@echo off
chcp 65001 >nul
echo ========================================
echo   智能温室 Vue3 Dashboard
echo ========================================
echo.

:: 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 安装依赖
echo [1/2] 正在安装依赖...
cd /d "%~dp0"
call npm install
echo      依赖安装完成!
echo.

:: 启动开发服务器
echo [2/2] 正在启动开发服务器...
echo.
echo ========================================
echo   地址: http://localhost:3000
echo   API 代理: http://123.207.45.73:8111
echo   按 Ctrl+C 停止
echo ========================================
echo.
call npm run dev

pause
