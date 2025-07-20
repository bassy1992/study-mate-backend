@echo off
title BECE Platform - Development Environment
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 BECE Platform Development                    ║
echo ║                    Starting Servers...                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Starting Django Backend Server...
start "BECE Backend - Django" cmd /k "title BECE Backend ^& color 0B ^& cd backend ^& echo Starting Django on http://127.0.0.1:8000 ^& echo. ^& python manage.py runserver"

echo [2/2] Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Development Server...
start "BECE Frontend - Vite" cmd /k "title BECE Frontend ^& color 0E ^& cd frontend ^& echo Starting Vite on http://127.0.0.1:8080 ^& echo. ^& npm run dev"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Servers Started!                         ║
echo ║                                                              ║
echo ║  Backend:  http://127.0.0.1:8000                           ║
echo ║  Frontend: http://127.0.0.1:8080                           ║
echo ║  API Test: http://127.0.0.1:8080/api-test                  ║
echo ║  Swagger:  http://127.0.0.1:8000/api/docs/                 ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Press any key to close this launcher...
pause > nul