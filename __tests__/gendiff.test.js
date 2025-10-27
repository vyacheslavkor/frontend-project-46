import { expect, test } from '@jest/globals'
import genDiff from '../src/differ.js'
import path from 'path'
import { parse } from '../src/parsers.js'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = filename => path.join(__dirname, '__fixtures__', filename)
const readFile = filename => fs.readFileSync(getFixturePath(filename), 'utf-8')

const formats_files = [
  ['stylish', 'file1.json', 'file2.json'],
  ['stylish', 'file1.yaml', 'file2.yaml'],
  ['plain', 'file1.json', 'file2.json'],
  ['plain', 'file1.yaml', 'file2.yaml'],
]

test.each(formats_files)('%s %s %s', (format, firstFileName, secondFileName) => {
  const firstFile = getFixturePath(firstFileName)
  const secondFile = getFixturePath(secondFileName)

  const expected = readFile(`${format}.txt`).trim()
  const parsedData = parse(firstFile, secondFile)

  const diff = genDiff(parsedData.firstFile, parsedData.secondFile, format)

  expect(diff).toBe(expected)
},
)
