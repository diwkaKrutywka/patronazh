function getBaseUrl() {
  // Check for runtime config first (this should be set by config.js)
  if ((window as any).APP_CONFIG?.BASE_API_URL) {
    console.log('Using runtime config:', (window as any).APP_CONFIG.BASE_API_URL);
    return (window as any).APP_CONFIG.BASE_API_URL;
  }

  // Fallback to build-time env if runtime config is not available
  if (typeof __VITE_BASE_API_URL__ !== 'undefined' && __VITE_BASE_API_URL__) {
    console.log('Using build-time env:', __VITE_BASE_API_URL__);
    return __VITE_BASE_API_URL__;
  }

  // Last fallback to import.meta.env
  if (import.meta.env.VITE_BASE_API_URL) {
    console.log('Using import.meta.env:', import.meta.env.VITE_BASE_API_URL);
    return import.meta.env.VITE_BASE_API_URL;
  }


  // Final fallback - auto-detect
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const currentPort = window.location.port;

  // If running on ngrok, use the same domain for API
  if (currentHost.includes('ngrok.io') || currentHost.includes('ngrok-free.app')) {
    const url = `${currentProtocol}//${currentHost}/api`;
    console.log('Using ngrok URL (fallback):', url);
    return url;
  }

  // If running on localhost, use localhost for API
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    const port = currentPort || (currentProtocol === 'https:' ? '443' : '80');
    const url = `${currentProtocol}//${currentHost}:${port}/api`;
    console.log('Using localhost URL (fallback):', url);
    return url;
  }

  // For any other domain, use the same domain
  const url = `${currentProtocol}//${currentHost}/api`;
  console.log('Using domain URL (fallback):', url);
  return url;
}

const baseUrl = {
  baseURL: getBaseUrl(),
};

// Debug log
console.log('Final baseUrl:', baseUrl.baseURL);
console.log('Current location:', window.location.href);
console.log('Runtime config:', (window as any).APP_CONFIG);

export default baseUrl;
