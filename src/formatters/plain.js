import _ from 'lodash'
import { toString } from './index.js'

const plain = (diff) => {
  const iter = (diff, path) => {
    const keys = getKeys(diff)

    const lines = _.reduce(keys, (result, key) => {
      const currentElement = diff[key]
      const state = currentElement.state
      let diffElement = []

      if (state === 'added' && _.has(currentElement, 'newValue')) {
        const value = getPlainValue(currentElement.newValue)
        diffElement = [`Property '${path}${key}' was added with value: ${value}`]
      }
      else if (state === 'removed') {
        diffElement = [`Property '${path}${key}' was removed`]
      }
      else if (
        state === 'updated'
        && _.has(currentElement, 'newValue')
        && _.has(currentElement, 'oldValue')
      ) {
        const oldValue = getPlainValue(currentElement.oldValue)
        const newValue = getPlainValue(currentElement.newValue)
        diffElement = [`Property '${path}${key}' was updated. From ${oldValue} to ${newValue}`]
      }
      else if (state === 'nested' && _.has(currentElement, 'children')) {
        diffElement = [iter(currentElement.children, `${path}${key}.`)]
      }

      return [...result, ...diffElement]
    }, [])

    return lines.join('\n')
  }

  return iter(diff, '')
}

const getPlainValue = (value) => {
  if (_.isString(value)) {
    return `'${value}'`
  }

  return _.isObject(value) ? '[complex value]' : toString(value)
}

const getKeys = diff => _.keys(diff)

export default plain
