const REQUEST_URL = `${process.env.HUE_BRIDGE_URL}/lights/3`

export default (_req, res) => {
  return fetch(REQUEST_URL + '/state', {
    method: 'PUT',
    body: JSON.stringify({ on: true, hue: 0 }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      res.json(data)
      return
    })
}
