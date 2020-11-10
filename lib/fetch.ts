import fetch from 'isomorphic-unfetch'

export default async function Fetch<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)
  return res.json()
}