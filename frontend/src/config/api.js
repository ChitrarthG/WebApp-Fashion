const apiBaseUrl = process.env.REACT_APP_API_URL;

if (!apiBaseUrl) {
  throw new Error('REACT_APP_API_URL is not configured. Add it to the frontend environment file for the current environment.');
}

export default apiBaseUrl;
