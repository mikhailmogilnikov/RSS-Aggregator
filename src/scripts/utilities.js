const normalizeUrl = (url) => url.trim().toLowerCase();

const normalizeError = (error) => error.toString().split(': ')[1];

export { normalizeUrl, normalizeError };
