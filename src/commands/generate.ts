import {Command} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'

interface Chunk {
  isEntry?: boolean;
  imports?: string[];
  css?: string [];
  file: string
}

interface Manifest {
  [key: string]: Chunk
}

interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean | undefined>
}

const externalRE = /^(https?:)?\/\//

export default class Generate extends Command {
  static description = 'Generate the AEM clientlib'

  static args = [
    {
      name: 'manifest',
      required: false,
      description: 'Location of the manifest file',
      default: 'manifest.json',
    },
  ]

  //TODO: split into methods
  async run() {
    const manifest = Generate.getManifest()
    const entry = Generate.getEntry(manifest)
    if (entry) {
      const imports = this.getImportedChunks(manifest, entry)
      const tags = [Generate.toScriptTag(entry), ...imports.map(Generate.toPreloadTag)]
      tags.push(...this.getCssTagsForChunk(manifest, entry))
      const serializedTags = this.serializeTags(tags)
      console.log(serializedTags)
    } else {
      this.error('No entry found', {exit: 2, suggestions: ['Make sure the manifest.json file contains an entry.']})
    }
  }

  //TODO: error handling?
  private static getManifest(): Manifest {
    // https://stackoverflow.com/questions/32705219/nodejs-accessing-file-with-relative-path
    // TODO: the next line probably needs updating once finished
    const jsonPath = path.join(__dirname, 'manifest.json')
    const jsonString = fs.readFileSync(jsonPath, 'utf8')
    return JSON.parse(jsonString)
  }

  private static getEntry(manifest: Manifest): Chunk | undefined {
    return Object.values(manifest)
      .find(chunk => this.isEntry(chunk))
  }

  private static isEntry(chunk: Chunk): boolean {
    return !!(chunk.isEntry && chunk.file)
  }

  private getImportedChunks(manifest: Manifest, chunk: Chunk, seen: Set<string> = new Set()) {
    const chunks: Chunk[] = []
    chunk.imports?.forEach((file) => {
      const importChunk = manifest[file]
      if (!seen.has(file)) {
        seen.add(file)
        chunks.push(...this.getImportedChunks(manifest, importChunk, seen))
        chunks.push(importChunk)
      }
    })
    return chunks
  }

  private getCssTagsForChunk(
    manifest: Manifest,
    chunk: Chunk,
    seen: Set<string> = new Set(),
    analyzedChunk: Map<Chunk, number> = new Map(),
  ): HtmlTagDescriptor[] {
    const tags: HtmlTagDescriptor[] = []
    if (!analyzedChunk.has(chunk)) {
      analyzedChunk.set(chunk, 1)
      chunk.imports?.forEach((file) => {
        const importChunk = manifest[file]
        tags.push(...this.getCssTagsForChunk(manifest, importChunk, seen, analyzedChunk))
      })
    }

    chunk.css?.forEach((file) => {
      if (!seen.has(file)) {
        seen.add(file)
        tags.push(Generate.toStyleTag(file))
      }
    })

    return tags
  }

  private static toScriptTag(chunk: Chunk): HtmlTagDescriptor {
    return {
      tag: 'script',
      attrs: {
        type: 'module',
        crossorigin: true,
        src: Generate.toPublicPath(chunk.file),
      },
    }
  }

  private static toPreloadTag(chunk: Chunk): HtmlTagDescriptor {
    return {
      tag: 'link',
      attrs: {
        rel: 'modulepreload',
        href: Generate.toPublicPath(chunk.file),
      },
    }
  }

  private static toStyleTag(file: string): HtmlTagDescriptor {
    return {
      tag: 'link',
      attrs: {
        rel: 'stylesheet',
        href: Generate.toPublicPath(file),
      },
    }
  }

  private static toPublicPath(file: string) {
    return Generate.isExternalUrl(file) ? file : `/${file}`
  }

  private static isExternalUrl(url: string): boolean {
    return externalRE.test(url)
  }

  private serializeTags(tags: HtmlTagDescriptor[]): string {
    return tags.map((tag) => `${Generate.serializeTag(tag)}\n`).join('')
  }

  private static serializeTag({tag, attrs}: HtmlTagDescriptor): string {
    return `<${tag}${Generate.serializeAttrs(attrs)}>`
  }

  private static serializeAttrs(attrs: HtmlTagDescriptor['attrs']): string {
    let res = ''
    for (const key in attrs) {
      if (typeof attrs[key] === 'boolean') {
        res += attrs[key] ? ` ${key}` : ``
      } else {
        res += ` ${key}=${JSON.stringify(attrs[key])}`
      }
    }
    return res
  }
}
