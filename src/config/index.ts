function getBaseUrl(): string {
  // Check for runtime config first
  if ((window as any).APP_CONFIG?.BASE_API_URL) {
    return (window as any).APP_CONFIG.BASE_API_URL;
  }

  // Fallback to env
  if (import.meta.env.VITE_BASE_API_URL) {
    return import.meta.env.VITE_BASE_API_URL;
  }

  // Auto-detect based on current URL
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const currentPort = window.location.port;

  // For ngrok
  if (currentHost.includes('ngrok.io') || currentHost.includes('ngrok-free.app')) {
    return `${currentProtocol}//${currentHost}/api`;
  }

  // For localhost
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    const port = currentPort || (currentProtocol === 'https:' ? '443' : '80');
    return `${currentProtocol}//${currentHost}:${port}/api`;
  }

  // Default: use current domain
  return `${currentProtocol}//${currentHost}/api`;
}

export default {
  baseURL: getBaseUrl()
};
