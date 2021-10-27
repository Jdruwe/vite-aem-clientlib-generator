import {Command} from '@oclif/command'
import * as fse from 'fs-extra'
import * as path from 'path'
import {getConfig, isValidConfig, Library} from '../config'
import {isExistingDir, toPublicPath} from '../utils'
import {Builder} from 'xml2js'

interface Manifest {
  [key: string]: Chunk;
}

interface Chunk {
  isEntry?: boolean;
  imports?: string[];
  css?: string [];
  file: string;
}

interface Sources {
  scripts: string[];
  preloads: string[];
  stylesheets: string[];
}

export default class Generate extends Command {
  static description = 'Generate the AEM clientlib'

  async run() {
    const config = this.getConfig()
    this.processLibs(config.libs)
  }

  private getConfig() {
    const config = getConfig()
    if (config) {
      if (isValidConfig(config)) {
        return config
      } else {
        this.error('Invalid configuration file')
      }
    } else {
      this.error('No configuration file found', {exit: 2, suggestions: ['Make sure a vite.lib.config.js file exists']})
    }
  }

  private processLibs(libs: Library[]) {
    libs.forEach(lib => {
      if (isExistingDir(lib.resourcesDir)) {
        const sources = this.getSources(lib)
        this.createClientlib(lib, sources)
        this.log(`vite-aem-clientlib-generator: clientlib with categories '${lib.categories}' has been generated`)
      } else {
        this.error('Resources directory not found: ' + lib.resourcesDir)
      }
    })
  }

  private getSources(lib: Library): Sources {
    const manifest = this.getManifest(lib.manifest)
    const entry = this.getEntry(manifest)
    return {
      scripts: [toPublicPath(entry.file)],
      preloads: this.getImportedFiles(manifest, entry),
      stylesheets: this.getCssFiles(manifest, entry),
    }
  }

  private getManifest(manifest: string): Manifest {
    try {
      return fse.readJsonSync(manifest)
    } catch (e) {
      this.error('Could not read manifest.json: ' + manifest)
    }
  }

  private getEntry(manifest: Manifest): Chunk {
    const entry = Object.values(manifest)
      .find(chunk => Generate.isEntry(chunk))

    if (entry) {
      return entry
    } else {
      this.error('No manifest entry found')
    }
  }

  private static isEntry(chunk: Chunk): boolean {
    return !!(chunk.isEntry && chunk.file)
  }

  private getImportedFiles(manifest: Manifest, chunk: Chunk, seen: Set<string> = new Set()): string[] {
    const files: string[] = []
    chunk.imports?.forEach((file) => {
      const importChunk = manifest[file]
      if (!seen.has(file)) {
        seen.add(file)
        files.push(...this.getImportedFiles(manifest, importChunk, seen))
        files.push(toPublicPath(importChunk.file))
      }
    })
    return files
  }

  private getCssFiles(
    manifest: Manifest,
    chunk: Chunk,
    seen: Set<string> = new Set(),
    analyzedChunk: Map<Chunk, number> = new Map(),
  ): string[] {
    const files: string[] = []
    if (!analyzedChunk.has(chunk)) {
      analyzedChunk.set(chunk, 1)
      chunk.imports?.forEach((file) => {
        const importChunk = manifest[file]
        files.push(...this.getCssFiles(manifest, importChunk, seen, analyzedChunk))
      })
    }

    chunk.css?.forEach((file) => {
      if (!seen.has(file)) {
        seen.add(file)
        files.push(toPublicPath(file))
      }
    })

    return files
  }

  private createClientlib(lib: Library, sources: Sources) {
    try {

      const clientlibResourcesDir = path.resolve(lib.clientlibDir, 'resources')
      const contentXmlPath = path.resolve(lib.clientlibDir, '.content.xml')

      fse.mkdirSync(clientlibResourcesDir, {recursive: true})
      fse.emptyDirSync(clientlibResourcesDir)
      fse.copySync(lib.resourcesDir, clientlibResourcesDir)

      const xml = {
        'jcr:root': {
          '$': {
            'xmlns:cq': 'http://www.day.com/jcr/cq/1.0',
            'xmlns:jcr': 'http://www.jcp.org/jcr/1.0',
            'jcr:primaryType': 'cq:ClientLibraryFolder',
            categories: `[${lib.categories.join(',')}]`,
            cssProcessor: '[default:none,min:none]',
            jsProcessor: '[default:none,min:none]',
            allowProxy: '{Boolean}true',
            scripts: `[${sources.scripts.join(',')}]`,
            preloads: `[${sources.preloads.join(',')}]`,
            stylesheets: `[${sources.stylesheets.join(',')}]`,
            ...lib.properties,
          },
        },
      }

      const builder = new Builder()
      fse.writeFileSync(contentXmlPath, builder.buildObject(xml))

    } catch (e) {
      this.error('Something went wrong while creating the clientlib: ' + e.message)
    }
  }
}
