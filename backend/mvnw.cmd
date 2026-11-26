@echo off
set "SCRIPT_DIR=%~dp0"
set "TOOLS_MVN=%SCRIPT_DIR%..\tools\apache-maven-3.9.9\bin\mvn.cmd"
set "REPO_DIR=%SCRIPT_DIR%..\.m2\repository"

if not exist "%REPO_DIR%" (
    mkdir "%REPO_DIR%"
)

if exist "%TOOLS_MVN%" (
    call "%TOOLS_MVN%" -Dmaven.repo.local="%REPO_DIR%" -f "%SCRIPT_DIR%pom.xml" %*
) else (
    call mvn -Dmaven.repo.local="%REPO_DIR%" -f "%SCRIPT_DIR%pom.xml" %*
)
