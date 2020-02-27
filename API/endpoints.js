const config = {
  host: 'http://192.168.1.40:8069',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  data_error: 'error',
  onFaild: err => {
    console.log('===== err ====> ', err);
  },
  endpoints: [
    {
      url: 'web/session/authenticate',
      method: 'post',
      id: 'login',
      action: 'USER_LOGIN',
      response: 'data',
    },
    {
      url: 'web/session/destroy',
      method: 'post',
      id: 'logout',
      action: 'USER_LOGOUT',
      response: 'data',
    },
    {
      url: 'web/dataset/call_kw/',
      method: 'post',
      id: 'partners',
      action: 'GET_PARTNER',
      response: 'result',
    },
    {
      url: 'web/dataset/call_kw/',
      method: 'post',
      id: 'data',
      action: 'GET_DATA',
      response: 'result',
    },
    {
      url: 'web/dataset/call_kw/',
      method: 'post',
      id: 'data1',
      action: 'GET_DATA1',
      response: 'result',
    },
  ],
};

export default config;
