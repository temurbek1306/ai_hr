@echo off
echo Creating 10 employees via API...
echo.

REM First login to get token
echo Logging in...
curl -X POST "http://94.241.141.229:8000/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin@gmail.com\",\"password\":\"admin123\"}" ^
  -o login-response.json

echo.
echo Creating employees...
echo.

REM Create 10 employees
curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Aziz Rahimov\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Madina Aliyeva\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Jamshid Tursunov\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Laylo Karimova\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Bobur Sobirov\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Dilnoza Yusupova\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Sardor Mahmudov\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Nilufar Ergasheva\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Otabek Karimov\",\"password\":\"password123\"}"

timeout /t 1 >nul

curl -X POST "http://94.241.141.229:8000/api/v1/employees" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"fullName\":\"Gulnora Sharipova\",\"password\":\"password123\"}"

echo.
echo Done!
pause
