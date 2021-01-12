import fetch from 'isomorphic-unfetch'

const REQUEST_URL = `${process.env.HUE_BRIDGE_URL}/lights/3`

export default async (req, res) => {
  const { query } = req
  let on = query.on

  let currentState = undefined

  if (query.on) {
    switch (query.on) {
      case 'false': {
        on = false
        break
      }
      case 'true': {
        on = true
        break
      }
      case 'default': {
        on = true
        break
      }
    }
  } else {
    await fetch(REQUEST_URL, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        currentState = data.state.on
        // toggle light state
        on = !currentState
        res.json(data)
      })
  }

  await fetch(REQUEST_URL + '/state', {
    method: 'PUT',
    body: JSON.stringify({ on: on }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      res.json(data)
    })
}
