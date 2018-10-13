/**
 * to-iso-date
 *
 * convert Date Object to ISO Date string
 *
 * @flow
 */

/// code

function toISODate(date: Date): string {
  return date.toISOString().substr(0, 10)
}


/// export

export default toISODate


/// test
