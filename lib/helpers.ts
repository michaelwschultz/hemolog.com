import { customAlphabet } from 'nanoid/async'
import { getYear } from 'date-fns'
import { InfusionType } from 'lib/db/infusions'

async function generateUniqueString(length = 6) {
  // removed 'i' and 'l' for clarity when reading the id on different mediums i.e. (paper, url)
  const alphabet = '0123456789ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz'
  const nanoid = customAlphabet(alphabet, length)
  const uniqueString = await nanoid()

  return uniqueString
}

const filterInfusions = (data: InfusionType[], filterYear: string) =>
  data && filterYear !== 'All time'
    ? data.filter((d) => getYear(new Date(d.date)) === parseInt(filterYear, 10))
    : data

export { generateUniqueString, filterInfusions }
