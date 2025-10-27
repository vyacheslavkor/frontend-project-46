import _ from 'lodash'
import getFormatter from './formatters/index.js'

const makeDiff = (first, second) => {
  const keys = getListKeys(first, second)

  return _.reduce(keys, (result, key) => {
    let diffNode

    if (!_.has(first, key)) {
      diffNode = {
        state: 'added',
        newValue: second[key],
      }
    }
    else if (!_.has(second, key)) {
      diffNode = {
        state: 'removed',
        oldValue: first[key],
      }
    }
    else if (first[key] === second[key]) {
      diffNode = {
        state: 'unchanged',
        oldValue: first[key],
      }
    }
    else if (!_.isObject(first[key]) || !_.isObject(second[key])) {
      diffNode = {
        state: 'updated',
        oldValue: first[key],
        newValue: second[key],
      }
    }
    else {
      diffNode = {
        state: 'nested',
        children: makeDiff(first[key], second[key]),
      }
    }

    return { ...result, [key]: diffNode }
  }, {})
}

const getListKeys = (first, second) => {
  const keysFirst = _.keys(first)
  const keysSecond = _.keys(second)

  const allKeys = _.union(keysFirst, keysSecond)

  return _.sortBy(allKeys)
}

const genDiff = (first, second, format) => {
  const diff = makeDiff(first, second)
  const formatter = getFormatter(format)

  return formatter(diff)
}

export default genDiff
