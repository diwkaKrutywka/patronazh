#!/bin/sh

# Create runtime config with dynamic URL detection
cat > /usr/share/nginx/html/config.js << 'EOF'
(function() {
  // Dynamic API URL detection
  function detectApiUrl() {
    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;
    
    // If running on ngrok, use the same domain for API
    if (currentHost.includes('ngrok.io') || currentHost.includes('ngrok-free.app')) {
      return currentProtocol + '//' + currentHost + '/api';
    }
    
    // If running on localhost, use localhost for API
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      const port = window.location.port || (currentProtocol === 'https:' ? '443' : '80');
      return currentProtocol + '//' + currentHost + ':' + port + '/api';
    }
    
    // For any other domain, use the same domain
    return currentProtocol + '//' + currentHost + '/api';
  }
  
  // Set the API URL
  window.APP_CONFIG = {
    BASE_API_URL: detectApiUrl()
  };
  
  console.log('Runtime config created with BASE_API_URL:', window.APP_CONFIG.BASE_API_URL);
  console.log('Current location:', window.location.href);
})();
EOF

echo "Created dynamic runtime config"

# Start nginx
exec nginx -g "daemon off;"
