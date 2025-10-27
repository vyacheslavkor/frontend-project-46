#!/usr/bin/env node
import { Command } from 'commander'
import { parse } from './src/parsers.js'
import genDiff from './src/differ.js'

const program = new Command()
program.description('Compares two configuration files and shows a difference.')
  .version('1.0.0', '-V, --version')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    try {
      const parsedData = parse(filepath1, filepath2)
      const outputFormatOption = program.getOptionValue('format')
      const outputFormat = outputFormatOption ? outputFormatOption : 'stylish'

      const diff = genDiff(parsedData.firstFile, parsedData.secondFile, outputFormat)

      console.log(diff)
    }
    catch (e) {
      console.log(e.message)
    }
  })

program.parse(process.argv)
