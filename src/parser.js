import { readFileSync } from 'node:fs'
import { cwd } from 'node:process'
import path from 'path'

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
  const supportedFormats = ['json']

  if (!supportedFormats.includes(firstFileFormat) || !supportedFormats.includes(secondFileFormat)) {
    return false
  }

  return firstFileFormat === secondFileFormat
}
