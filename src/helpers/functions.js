/**
 * Round number to specific decimal amount
 * @method getRound
 * @param  {Number} [val=0]
 * @param  {Number} [decimals=0]
 * @return {Number}
 */
export const getRound = (val = 0, decimals = 0) => {
  if (!val) return null

  const multiplier = Math.pow(10, decimals) || 1

  return Math.round(val * multiplier) / multiplier
}

/**
 * Get sum of an array of numbers
 * @method getSum
 * @param  {Array} arr
 * @return {Number}
 */
export const getSum = (arr) => {
  return arr.reduce((a, b) => a + b)
}

/**
 * Get exponential moving average
 * @method getEMA
 * @param  {Number} close
 * @param  {Number} prevEMA
 * @param  {Number} period
 * @return {Number}
 */
export const getEMA = (close, prevEMA, period) => {
  const multiplier =  2 / (period + 1)
  const ema = (close - prevEMA) * multiplier + prevEMA

  return ema
}

/**
 * Format large numbers to strings
 * @method formatBigNumber
 * @param  {Number}        [number=0]
 * @param  {Number}        [decimals=0]
 * @return {String}
 */
export const formatBigNumber = (number = 0, decimals = 0) => {
  if (number > 999 && number < 999999) {
    return `${getRound(number / 1000, decimals)}k`
  }

  if (number > 999999 && number < 999999999) {
    return `${getRound(number / 1000000, decimals)}m`
  }

  if (number > 999999999 && number < 999999999999) {
    return `${getRound(number / 1000000000, decimals)}b`
  }

  return number
}

/**
 * Common date formatter for chart ticks
 * @method formatDate
 * @param  {String}      d
 * @return {String}
 */
export const formatDate = d => {
  const date = new Date(d)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

/**
 * Get URL parameter values
 * https://stackoverflow.com/a/901144
 * @method getURLParam
 * @param  {String}    paramName
 * @param  {String}    url
 * @return {String}
 */
export const getURLParam = (paramName, url) => {
  if (!url) url = window.location.href

  paramName = paramName.replace(/[[]]/g, '\\$&')

  const regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)

  if (!results) return null

  if (!results[2]) return ''

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * Get SMA signal data using linedata
 * @method getSignalDataSMA
 * @param  {Array}         [lineData=[]]
 * @return {Array}
 */
export const getSignalDataSMA = (lineData = []) => {
  const signalData = []

  lineData.forEach((curr, i, arr) => {
    const prev = arr[i - 1]

    if (prev && curr.sma2 && curr.sma1 > curr.sma2) {
      if (prev.sma1 <= prev.sma2) {
        signalData.push({
          type: 'up',
          x: curr.date,
          y: (curr.sma1 + curr.sma2) / 2
        })
      }
    }

    if (prev && curr.sma1 <= curr.sma2) {
      if (prev.sma1 > prev.sma2) {
        signalData.push({
          type: 'down',
          x: curr.date,
          y: (curr.sma1 + curr.sma2) / 2
        })
      }
    }
  })

  return signalData
}

export const getSignalDataWithLimits = (lineData = [], limitLower = 0, limitUpper = 0, dataKey) => {
  const signalData = []

  lineData.forEach((curr, i, arr) => {
    const prev = arr[i - 1]

    if (prev && prev[dataKey] < limitUpper && curr[dataKey] > limitUpper) {
      signalData.push({
        type: 'up',
        x: curr.date,
        y: limitUpper
      })
    }

    if (prev && prev[dataKey] > limitLower && curr[dataKey] < limitLower) {
      signalData.push({
        type: 'down',
        x: curr.date,
        y: limitLower
      })
    }
  })

  return signalData
}
