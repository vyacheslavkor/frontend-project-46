import { readFileSync } from 'node:fs'
import { cwd } from 'node:process'

export const parse = (file1, file2) => {
    try {
        return { file1: readFileSync(file1).toString('utf8'), file2: readFileSync(file2).toString('utf8') }
    }
    catch (e) {
        console.log(e.toString())
    }
}
