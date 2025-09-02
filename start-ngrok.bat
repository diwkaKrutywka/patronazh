@echo off
echo Starting care-crm with ngrok support...

REM Build the application
echo Building application...
docker-compose -f docker-compose.dev.yml build

REM Start the application
echo Starting application...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo Application is running on http://localhost:8088
echo.
echo To expose via ngrok, run:
echo ngrok http 8088
echo.
echo Then update your stack.env with the ngrok URL if needed
pause



