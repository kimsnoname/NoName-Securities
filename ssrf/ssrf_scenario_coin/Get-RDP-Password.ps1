# PowerShell 스크립트 시작

# 사용자 입력을 통한 인스턴스 ID와 키 페어 파일 경로 설정
$instanceId = Read-Host -Prompt "Enter the Instance ID"
$keyPairFileName = Read-Host -Prompt "Enter the Key Pair File Name (e.g., key.pem)"

# 현재 디렉토리 경로 가져오기
$currentDirectory = Get-Location

# 키 페어 파일의 전체 경로 구성
$keyPairFilePath = Join-Path -Path $currentDirectory -ChildPath $keyPairFileName

# 키 페어 파일이 존재하는지 확인
if (-Not (Test-Path -Path $keyPairFilePath)) {
    Write-Output "Error: The key pair file '$keyPairFilePath' does not exist."
    exit 1
}

# AWS CLI 명령어 실행
try {
    $passwordData = aws ec2 get-password-data --instance-id $instanceId --priv-launch-key $keyPairFilePath --query 'PasswordData' --output text

    if ($passwordData -eq $null -or $passwordData -eq "") {
        Write-Output "Error: Unable to decrypt password data. Ensure the private key matches the key pair used to create the instance."
    } else {
        # 비밀번호 출력
        Write-Output "RDP Password: $passwordData"
    }
} catch {
    Write-Output "Error: $($_.Exception.Message)"
}

# PowerShell 스크립트 끝
