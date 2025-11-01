@echo off
echo Installing Water Allocation Monitoring System...
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo.
echo Installation completed successfully!
echo.
echo To start the application, run: npm start
echo.
pause







