/*
 * handleResponseErr - to get the error message when fetch the API
 * Return: (String) - error message
 *
 * @err : (Object) - error object
 */
export default function handleResponseErr(err, errKey) {
  // check if there any response from the server
  const response = typeof err.response !== 'undefined' ? err.response : false

  // check if the server send any data
  const resData = response.hasOwnProperty('data') ? response.data : false

  // if the server not return any response put browser error
  const error = !resData ? err.message : false

  // the result error message
  const errMesg = error
    ? error
    : resData.message
    ? resData.message
    : resData.error

  switch (errMesg) {
    case 'Not Found':
      return 'Request wrong API'

    case 'Network Error':
      return "Can't send request to the server, please check your internet connection!"

    default:
      return errMesg
  }
}
