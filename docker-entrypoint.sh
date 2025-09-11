#!/bin/sh

# Determine API URL from environment variables (prefer VITE_BASE_URL, fallback to VITE_BASE_API_URL)
API_URL="${VITE_BASE_URL:-${VITE_BASE_API_URL:-}}"

# Create runtime config
cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = {
  BASE_API_URL: '${API_URL}'
};
EOF

# Start nginx
exec nginx -g "daemon off;"