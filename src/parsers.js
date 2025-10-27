import { readFileSync } from 'node:fs'
import { cwd } from 'node:process'
import path from 'node:path'
import yaml from 'js-yaml'

export const parse = (firstFile, secondFile) => {
  const firstFileFormat = getFileFormat(firstFile)
  const secondFileFormat = getFileFormat(secondFile)
  if (!checkFilesFormat(firstFileFormat, secondFileFormat)) {
    throw new Error('Unsupported file format.')
  }

  const firstFileContent = getFileContent(firstFile)
  const secondFileContent = getFileContent(secondFile)

  return {
    firstFile: parseByFormat(firstFileContent, firstFileFormat),
    secondFile: parseByFormat(secondFileContent, secondFileFormat),
  }
}

const parseByFormat = (content, format) => {
  const map = {
    json: content => JSON.parse(content),
    yaml: content => yaml.load(content),
    yml: content => yaml.load(content),
  }

  return map[format](content)
}

const getFileContent = (file) => {
  const firstFileAbsolutePath = getAbsoluteFilePath(file)

  return readFileSync(firstFileAbsolutePath).toString('utf8')
}

const getAbsoluteFilePath = file => path.resolve(cwd(), file)

const getFileFormat = (file) => {
  const fileExt = path.extname(file)
  return fileExt ? fileExt.slice(1).toLowerCase() : false
}

const checkFilesFormat = (firstFileFormat, secondFileFormat) => {
  const supportedFormats = new Set(['json', 'yaml', 'yml'])

  if (!supportedFormats.has(firstFileFormat) || !supportedFormats.has(secondFileFormat)) {
    return false
  }

  return firstFileFormat === secondFileFormat
}
