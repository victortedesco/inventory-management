@echo off
echo Iniciando Users.API...
start cmd /k "cd /d %~dp0src\api\Users\Users.API && dotnet run"

echo Iniciando Products.API...
start cmd /k "cd /d %~dp0src\api\Products\Products.API && dotnet run"

echo Iniciando Web (npm run dev)...
start cmd /k "cd /d %~dp0src\web && npm run dev"

