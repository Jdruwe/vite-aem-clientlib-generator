import * as path from 'path'
import * as fse from 'fs-extra'

interface Configuration {
  libs: Library[]
}

export interface Library {
  manifest: string,
  resourcesDir: string,
  clientlibDir: string,
  categories: string[],
  properties: {
    [key: string]: string
  }
}

export const getConfig = (): Configuration | null => {
  const configPath = path.resolve(process.cwd(), 'vite.lib.config.js')
  if (fse.existsSync(configPath)) {
    return require(configPath)
  } else {
    return null
  }
}

export const isValidConfig = (config: Configuration): boolean => {
  return config.libs.every((lib) => isValidLib(lib))
}

const isValidLib = (lib: Library): boolean => {
  return !!lib.resourcesDir
    && !!lib.clientlibDir
    && !!lib.manifest
    && Array.isArray(lib.categories)
    && !!lib.categories.length
}
