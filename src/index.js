import { parse } from './parsers.js'
import genDiff from './differ.js'

const gendiff = (filepath1, filepath2, format) => {
  const parsedData = parse(filepath1, filepath2)

  return genDiff(parsedData.firstFile, parsedData.secondFile, format)
}

export default gendiff
