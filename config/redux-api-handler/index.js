import axios from 'axios';
import qs from 'qs';
import handleResponseErr from './handleResponseErr';

const prefix = '@RAH';
window.RAH_prefix = prefix;

const DEFAULT_HEADERS = {
  Accept: 'application/json',
};

function sendAPIRequest(requestConfig) {
  return axios(requestConfig);
}

function removeNullValues(obj) {
  let result = {};

  if (!obj) {
    return false;
  }

  Object.keys(obj).map(key => {
    if (!obj[key]) {
      return false;
    }

    if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
      result[key] = removeNullValues(obj[key]);
      return false;
    }

    result[key] = obj[key];
    return null;
  });
  return result;
}

async function generateReqConfig(config, endpoint, action) {
  const ep_headers = {
    ...config.headers,
    ...endpoint.headers,
  };

  const headers =
    Object.keys(ep_headers).length > 0 ? ep_headers : DEFAULT_HEADERS;
  const url = `${config.host}/${endpoint.url}`;
  const params = removeNullValues(action.params);
  const data = action.data;
  return {
    url: action.vars ? replaceUrl(url, action.vars) : url,
    method: endpoint.method,
    headers,
    data,
    params,
    paramsSerializer: function(params) {
      return qs.stringify(params, {encode: false});
    },
  };
}

function getData(res, str) {
  if (!str) {
    return res;
  }
  const keys = str.split('.');
  if (keys.length === 0) {
    return res[str];
  }
  let result = res;
  keys.map(key => {
    result = result[key];
    return null;
  });
  return result;
}

function replaceUrl(url, data) {
  var regex = new RegExp(':(' + Object.keys(data).join('|') + ')', 'g');
  return url.replace(regex, (m, $1) => data[$1] || m);
}
// _storeData = async () => {
export const reduxAPIHandler = config => {
  window.config = config;

  return store => next => async action => {
    const endpoint = config.endpoints.filter(
      ep => ep.action === action.type,
    )[0];

    if (action.type === 'RAH_RESET') {
      store.dispatch({
        type: `${prefix}_RESET`,
        keys: action.keys,
        reset: action.reset,
      });
      return false;
    }

    if (endpoint) {
      const requestConfig = await generateReqConfig(config, endpoint, action);
      store.dispatch({
        type: `${prefix}_${endpoint.action.toUpperCase()}_PENDING`,
        endpoint,
      });
      sendAPIRequest(requestConfig)
        .then(response => {
          store.dispatch({
            type: `${prefix}_${endpoint.action.toUpperCase()}_FULFILLED`,
            payload: getData(
              response.data,
              action.response || endpoint.response,
            ),
            endpoint,
            onSuccess: action.onSuccess,
          });
          if (action.onFulfilled) {
            action.onFulfilled(response);
          }
        })
        .catch(err => {
          const error = handleResponseErr(err, config.data_error);
          if (action.onFaild) {
            action.onFaild(error);
          } else if (endpoint.onFaild) {
            endpoint.onFaild(error);
          } else {
            config.onFaild(error);
          }
          store.dispatch({
            type: `${prefix}_${endpoint.action.toUpperCase()}_FAILED`,
            payload: handleResponseErr(err, config.data_error),
            endpoint,
          });
        });
      return false;
    }

    next(action);
  };
};
