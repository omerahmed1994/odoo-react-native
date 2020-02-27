const defaultRequest = {
  status: 'hold',
  fetching: false,
  loading: false,
  error: null,
}
function handleOnSuccess(data, payload, ep, status) {
  const arr = typeof data === 'object' && data ? data : []
  switch (status) {
    case 'unshift':
      arr.unshift(payload)
      return arr

    case 'push':
      arr.push(payload)
      return arr

    case 'remove':
      return arr.filter(item => item[ep.removeBy] !== payload[ep.removeBy])

    case 'update':
      const objIndex = arr.findIndex(
        obj => obj[ep.updateBy] === payload[ep.updateBy],
      )
      arr[objIndex] = payload
      return [...arr]

    case 'merge':
      return [...arr, ...payload]

    default:
      return payload
  }
}

function handleOnPending(data, action) {
  switch (action) {
    case 'reset':
      return null

    default:
      return data
  }
}

function defaultValues(endpoints) {
  let result = {}
  const defaultRequest = {
    status: 'hold',
    error: null,
    fetching: false,
    loading: false,
  }
  endpoints.map(endpoint => {
    const m = result.requests
      ? result.requests.hasOwnProperty(endpoint.id)
      : null
    result = {
      ...result,
      [endpoint.id]: null,
      requests: {
        ...result.requests,
        [endpoint.id]: {
          ...(m ? result.requests[endpoint.id] : null),
          [endpoint.method]: defaultRequest,
        },
      },
    }
    return null
  })
  return result
}

export default function reducer(state = false, action) {
  if (!state && window.config) {
    return defaultValues(window.config.endpoints)
  }
  const prefix = window.RAH_prefix

  if (action.type === `${prefix}_INIT`) {
    return action.payload
  }

  if (action.type === `${prefix}_RESET`) {
    console.log('action.reset', action.reset)
    action.keys.map(key => {
      state[key] = !action.reset
        ? null
        : action.reset === 'data' || action.reset === 'all'
          ? null
          : state[key]
      Object.keys(state.requests[key]).map(method => {
        state.requests[key][method] = !action.reset
          ? defaultRequest
          : action.reset === 'request' || action.reset === 'all'
            ? defaultRequest
            : state.requests[key][method]
        return null
      })
      return null
    })
    return state
  }

  if (action.type.startsWith(prefix)) {
    const status = action.type.split('_').slice(-1)[0]
    const ep = action.endpoint

    switch (status) {
      case 'PENDING':
        return {
          ...state,
          [ep.id]: handleOnPending(state[ep.id], ep.onPending),
          requests: {
            ...state.requests,
            [ep.id]: {
              ...state.requests[ep.id],
              [ep.method]: {
                ...state.requests[ep.id][ep.method],
                status: 'pending',
                fetching: true,
                loading: !state[ep.id],
                error: null,
              },
            },
          },
        }

      case 'FULFILLED':
        return {
          ...state,
          [ep.id]: handleOnSuccess(
            state[ep.id],
            action.payload,
            ep,
            ep.onSuccess || action.onSuccess,
          ),
          requests: {
            ...state.requests,
            [ep.id]: {
              ...state.requests[ep.id],
              [ep.method]: {
                ...state.requests[ep.id][ep.method],
                status: 'fulfilled',
                loading: false,
                fetching: false,
                error: null,
              },
            },
          },
        }

      case 'FAILED':
        return {
          ...state,
          requests: {
            ...state.requests,
            [ep.id]: {
              ...state.requests[ep.id],
              [ep.method]: {
                ...state.requests[ep.id][ep.method],
                status: 'failed',
                loading: false,
                fetching: false,
                error: action.payload,
              },
            },
          },
        }

      default:
        return state
    }
  }

  return state
}
