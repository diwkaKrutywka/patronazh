function getBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL as string;
}

const baseUrl = {
  baseURL: getBaseUrl(),
};

export default baseUrl;
