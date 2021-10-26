import * as fse from 'fs-extra'

const externalRE = /^(https?:)?\/\//

export const isExistingDir = (dir: string) => {
  return fse.pathExistsSync(dir)
}

export const toPublicPath = (file: string) => {
  return isExternalUrl(file) ? file : `/${file}`
}

export const isExternalUrl = (url: string): boolean => {
  return externalRE.test(url)
}
