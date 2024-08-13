# PEM 파일 경로
$pemFilePath = "C:\Users\r2com\Desktop\final_project\ssrf_scenario\adminKey.pem"

# 암호화된 비밀번호
$encryptedPassword = "awFqEvRq4MVxZ+QJtCzSYP/YjpQJSjV9MkRxc6C6PYE9ycs+Wo0DP4gejVFrPsRqaK+lKfIjmdSPOLE85RAhz3q6hW9XUpyG5sx9G4YjqHWYeFa75JwGQ0bVd3qc6CTH2YEI5ilJgOrHDnhE5yiQvuyWvcfGa0v1HCoxF2mHzCccJBHqg9dVfiLQUynAsDCzbfYnHbC0eV58QqUnzihH7JUq/eG1PglJx3SpT5hbsluOa6fyFfE3GnHqnY6mz3N8af4W6Ca3Pi460v+nY1v9bbsTECNGvCWJ+U8aFasYA532QX9W/NOOj3eKGytsC7t8ZVX4gtRSoMfiaU0XuBUZcg=="

# Base64 디코딩
$decodedPasswordBytes = [System.Convert]::FromBase64String($encryptedPassword)
$decodedPasswordPath = "C:\Users\r2com\Desktop\final_project\ssrf_scenario\encrypted_password.bin"
[System.IO.File]::WriteAllBytes($decodedPasswordPath, $decodedPasswordBytes)

# OpenSSL을 사용하여 비밀번호 복호화
$decryptedPasswordPath = "C:\Users\r2com\Desktop\final_project\ssrf_scenario\decrypted_password.txt"
& openssl pkeyutl -decrypt -inkey $pemFilePath -in $decodedPasswordPath -out $decryptedPasswordPath

# 복호화된 비밀번호 출력
Get-Content $decryptedPasswordPath
