function getBaseUrl() {
  // Check for runtime config first, then build-time env
  return (window as any).APP_CONFIG?.BASE_API_URL || import.meta.env.VITE_BASE_API_URL || '';
}


const baseUrl = {
  baseURL: getBaseUrl(),
};

export default baseUrl;
