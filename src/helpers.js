import { history } from 'utils'
import * as accounting from 'accounting'
import * as moment from 'moment'

/**
 * Filters an array of objects with multiple criteria.
 *
 * @param  { Array }  array: the array to filter
 * @param  { Object } filters: an object with the filter criteria as the property names
 * @return { Array object }
 */
export const multiFilter = (arr, filters) => {
  const filterKeys = Object.keys(filters)
  return arr.filter((eachObj) => {
    return filterKeys.every((eachKey) => {
      if (!filters[eachKey].length) {
        return true // Passing an empty filter means that filter is ignored.
      }
      return filters[eachKey].includes(eachObj[eachKey])
    })
  })
}

/**
 * General helper functions
 */
export const compareSortValue = (a, b) => {
  if (a.sortValue < b.sortValue)
    return -1
  else if (a.sortValue > b.sortValue)
    return 1
  else
    return 0
}

export const getArrayUnique = (arr, comp) => {
  const unique = arr
    .map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i) // store the keys of the unique objects
    .filter(e => arr[e]).map(e => arr[e]) // eliminate the dead keys & store unique objects
  return unique
}

export const removeArrayDuplicates = (arr) => {
  const unique = arr.reduce((r, i) =>
    !r.some(j => !Object.keys(i).some(k => i[k] !== j[k])) ? [...r, i] : r, [])
  return unique
}

export const getArrayIntersect = (arrA, arrB) => (
  arrA.filter(x => arrB.includes(x))
)

export const getUrlParameter = (sParam) => {
  let sPageURL = history.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=')
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1]
    }
  }
}

/**
 * Currency handling - accounting
 */
export const currencyFormatAU = (value) => {
  return accounting.formatMoney(value, '$', 2, ".", ",")
}

/**
 * UTC time handling - Moment
 */
export const timeFormatAU = (UTCFormat, locale) => {
  const formattedTime = moment(UTCFormat, 'DD/MM/YYYY HH:mm', locale, true)
  return formattedTime
}
