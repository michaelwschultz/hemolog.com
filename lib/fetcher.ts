import fetch from 'isomorphic-unfetch'

const fetcher = async <JSON = any>(
  input: RequestInfo,
  token?: string
): Promise<JSON> => {
  const res = await fetch(input, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  })
  return res.json()
}

export default fetcher
