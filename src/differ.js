import _ from 'lodash'

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

const stylish = (diff) => {
  const replacer = ' '
  const spacesCount = 2

  const iter = (value, depth) => {
    if (!_.isObject(value)) {
      return toString(value)
    }

    const indentSize = spacesCount * depth + spacesCount * (depth - 1)
    const bracketIndent = replacer.repeat(indentSize - spacesCount)

    const getIndent = (val) => {
      if (
        val
        && typeof val === 'object'
        && 'state' in val
        && ['added', 'removed', 'updated'].includes(val.state)
      ) {
        return replacer.repeat(indentSize)
      }

      return replacer.repeat(indentSize + spacesCount)
    }

    const keys = _.keys(value)

    const lines = keys.flatMap((key) => {
      const val = value[key]

      let valueToShow
      let isObject = false

      if (!(val && typeof val === 'object' && 'state' in val)) {
        valueToShow = val
      }
      else {
        isObject = true
        switch (val.state) {
          case 'added':
            valueToShow = val.newValue
            break
          case 'removed':
          case 'unchanged':
            valueToShow = val.oldValue
            break
          case 'nested':
            valueToShow = val.children
            break
          case 'updated':
            break
          default:
            valueToShow = null
        }
      }

      if (isObject) {
        switch (val.state) {
          case 'removed':
            return `${getIndent(val)}- ${key}: ${iter(valueToShow, depth + 1)}`
          case 'added':
            return `${getIndent(val)}+ ${key}: ${iter(valueToShow, depth + 1)}`
          case 'updated': {
            const lineBefore = `${getIndent(val)}- ${key}: ${iter(val.oldValue, depth + 1)}`
            const lineAfter = `${getIndent(val)}+ ${key}: ${iter(val.newValue, depth + 1)}`
            return [lineBefore, lineAfter]
          }
          case 'nested':
            return `${getIndent(val)}${key}: ${iter(valueToShow, depth + 1)}`
          case 'unchanged':
            return `${getIndent(val)}${key}: ${iter(valueToShow, depth + 1)}`
          default:
            return `${getIndent(val)}${key}: ${iter(valueToShow, depth + 1)}`
        }
      }

      return `${getIndent(val)}${key}: ${iter(valueToShow, depth + 1)}`
    })

    return ['{', ...lines.flat(), `${bracketIndent}}`].join('\n')
  }

  return iter(diff, 1)
}

const toString = (value) => {
  if (value === null) {
    return 'null'
  }

  if (value === undefined) {
    return 'undefined'
  }

  return String(value).trim()
}

export default (first, second, format = 'stylish') => {
  const diff = makeDiff(first, second)

  return stylish(diff)
}
