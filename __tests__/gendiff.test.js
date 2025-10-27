import { expect, test } from '@jest/globals'
import path from 'path'
import { parse } from '../src/parsers.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import getFormatter from '../src/formatters/index.js'
import gendiff from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = filename => path.join(__dirname, '__fixtures__', filename)
const readFile = filename => fs.readFileSync(getFixturePath(filename), 'utf-8')

const formatsFiles = [
  ['stylish', 'file1.json', 'file2.json'],
  ['stylish', 'file1.yaml', 'file2.yml'],
  ['plain', 'file1.json', 'file2.json'],
  ['plain', 'file1.yaml', 'file2.yml'],
  ['json', 'file1.json', 'file2.json'],
  ['json', 'file1.yaml', 'file2.yml'],
]

test.each(formatsFiles)('%s %s %s', (format, firstFileName, secondFileName) => {
  const firstFile = getFixturePath(firstFileName)
  const secondFile = getFixturePath(secondFileName)

  const expected = readFile(`${format}.txt`).trim()

  const diff = gendiff(firstFile, secondFile, format)

  expect(diff).toBe(expected)
},
)

test('unsupported output format', () => {
  expect(() => getFormatter('asd')).toThrow()
})

test('unsupported file format', () => {
  expect(() => parse('test.asd', 'test2')).toThrow()
})
