@echo off
title Smart Campus Lost & Found - Spring Boot Backend
echo =====================================================================
echo  STARTING SMART CAMPUS LOST & FOUND - SPRING BOOT BACKEND
echo =====================================================================
echo.
cd /d "%~dp0"

echo Checking for packaged JAR...
if not exist "backend\target\smart-lost-found-1.0.0.jar" (
    echo Building backend JAR with Maven...
    call mvnw.cmd package -DskipTests
)

echo.
echo Choose your Database Profile:
echo [1] MySQL 8.0 Database (Default: smart_lost_found on localhost:3306)
echo [2] Instant In-Memory Mode (H2 with MySQL Compatibility - Zero Install)
echo.
set /p dbchoice="Select option (1 or 2, default is 1): "

if "%dbchoice%"=="2" (
    echo.
    echo Starting Spring Boot Backend with In-Memory Database (H2)...
    java "-Dspring.profiles.active=h2" -jar "backend\target\smart-lost-found-1.0.0.jar"
) else (
    echo.
    echo Starting Spring Boot Backend with MySQL Database...
    echo (Ensure MySQL service is running and database 'smart_lost_found' exists)
    java -jar "backend\target\smart-lost-found-1.0.0.jar"
)
pause

