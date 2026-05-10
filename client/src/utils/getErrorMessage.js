function getErrorMessage(error, fallbackMessage) {
  return error?.userMessage || error?.response?.data?.message || fallbackMessage;
}

export default getErrorMessage;
