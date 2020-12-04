import { customAlphabet } from 'nanoid/async'

async function generateUniqueString(length: number = 6) {
  // removed 'i' and 'l' for clarity when reading the id on different mediums i.e. (paper, url)
  const alphabet = '0123456789ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz'
  const nanoid = customAlphabet(alphabet, length)
  const uniqueString = await nanoid()

  return uniqueString
}

export { generateUniqueString }
