@echo off
title Smart Campus Lost & Found - React Frontend
echo =====================================================================
echo  STARTING SMART CAMPUS LOST & FOUND - VITE REACT FRONTEND
echo =====================================================================
echo.
cd /d "%~dp0frontend"

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm.cmd install
)

echo Starting Vite Development Server on http://localhost:5173 ...
call npm.cmd run dev
pause

