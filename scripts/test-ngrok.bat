@echo off
echo Testing ngrok configuration...

REM Stop existing containers
echo Stopping existing containers...
docker-compose -f docker-compose.dev.yml down

REM Rebuild with new configuration
echo Rebuilding with new configuration...
docker-compose -f docker-compose.dev.yml build --no-cache

REM Start the application
echo Starting application...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo Application is running on http://localhost:8088
echo.
echo To test with ngrok:
echo 1. Run: ngrok http 8088
echo 2. Open the ngrok URL in browser
echo 3. Check browser console for API URL
echo.
echo Expected behavior:
echo - When accessed via localhost: should use http://localhost:8088/api
echo - When accessed via ngrok: should use https://your-ngrok-url.ngrok.io/api
echo.
pause


