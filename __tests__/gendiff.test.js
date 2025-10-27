import { expect, test } from '@jest/globals'
import genDiff from '../src/differ.js'
import path from 'path'
import { parse } from '../src/parser.js'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = filename => path.join(__dirname, '__fixtures__', filename)
const readFile = filename => fs.readFileSync(getFixturePath(filename), 'utf-8')

test('stylish', () => {
  const firstFile = getFixturePath('file1.json')
  const secondFile = getFixturePath('file2.json')
  const expected = readFile('expected_diff.txt').trim()

  const parsedData = parse(firstFile, secondFile)
  const diff = genDiff(parsedData.firstFile, parsedData.secondFile)

  expect(diff).toBe(expected)
})
