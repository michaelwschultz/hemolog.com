import { customAlphabet } from 'nanoid/async'
import { getYear } from 'date-fns'
import type { TreatmentType } from 'lib/db/infusions'

async function generateUniqueString(length = 6) {
  // removed 'i' and 'l' for clarity when reading the id on different mediums i.e. (paper, url)
  const alphabet = '0123456789ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz'
  const nanoid = customAlphabet(alphabet, length)
  const uniqueString = await nanoid()

  return uniqueString
}

const filterInfusions = (data: TreatmentType[], filterYear: string) =>
  data && filterYear !== 'All time'
    ? data.filter((d) => {
        const [year, month, day] = d.date.split('-').map(Number)
        return (
          getYear(new Date(year, month - 1, day)) ===
          Number.parseInt(filterYear, 10)
        )
      })
    : data

export { generateUniqueString, filterInfusions }
