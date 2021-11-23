// NOTE(michael): this endpoint isn't used anywhere and was just an
// exploration of the HUE api.
const REQUEST_URL = `${process.env.HUE_BRIDGE_URL}/lights/3`

const flipLights = async (req: any, res: any) => {
  const { query } = req
  let on = query.on

  let currentState = undefined

  // NOTE(michael) this is only needed if I want to accept a query param
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
    return fetch(REQUEST_URL, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        currentState = data.state.on
        // toggle light state
        on = !currentState

        return fetch(REQUEST_URL + '/state', {
          method: 'PUT',
          body: JSON.stringify({ on: on }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            res.json(data)
            return
          })
      })
  }

  return fetch(REQUEST_URL + '/state', {
    method: 'PUT',
    body: JSON.stringify({ on: on }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      res.json(data)
      return
    })
}

export default flipLights
