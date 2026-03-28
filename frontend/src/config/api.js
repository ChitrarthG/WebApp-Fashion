const apiBaseUrl = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
	? 'http://localhost:5001/api'
	: '/api');

export default apiBaseUrl;
