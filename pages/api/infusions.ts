import fetch from "isomorphic-unfetch"

const REQUEST_URL = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values:batchGet?ranges=Log&key=${process.env.GOOGLE_SHEETS_API_KEY}`

export default async (_req, res) => {
  await fetch(REQUEST_URL)
    .then((resp) => resp.json())
    .then((data) => {
      res.json(data)
    })
}
