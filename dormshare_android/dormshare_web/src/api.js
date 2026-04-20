export const API_BASE = '/api';

export const request = async (endpoint, options = {}, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body !== 'string' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
  }
  
  if (options.body instanceof FormData) {
      delete headers['Content-Type']; // Let browser set boundary
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  // if not ok, try to parse text for error message
  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try {
        const json = JSON.parse(text);
        message = json.message || json.error || text;
    } catch (e) {}
    throw new Error(message || 'Network request failed');
  }

  // empty responses
  const text = await response.text();
  if (!text) return null;
  
  try {
      return JSON.parse(text);
  } catch (e) {
      return text; // Return plain text if not JSON
  }
};
