import boto3
import time


# AWS 클라이언트 초기화
ec2_client = boto3.client('ec2', region_name='ap-northeast-2')

# VPC 생성
vpc_response = ec2_client.create_vpc(
    CidrBlock='10.0.0.0/16' 
)
vpc_id = vpc_response['Vpc']['VpcId']
print(f'Created VPC with ID: {vpc_id}')

# 태그 추가 (선택 사항)
ec2_client.create_tags(
    Resources=[vpc_id],
    Tags=[{'Key': 'Name', 'Value': 'coinMiningVPC'}]
)

# 서브넷 생성
subnet_response = ec2_client.create_subnet(
    CidrBlock='10.0.1.0/24',
    VpcId=vpc_id,
    AvailabilityZone='ap-northeast-2c'  # 지원되는 가용 영역 지정
)
subnet_id = subnet_response['Subnet']['SubnetId']
print(f'Created Subnet with ID: {subnet_id}')

# 태그 추가 (선택 사항)
ec2_client.create_tags(
    Resources=[subnet_id],
    Tags=[{'Key': 'Name', 'Value': 'coinMiningSubnet'}]
)

# 인터넷 게이트웨이 생성
igw_response = ec2_client.create_internet_gateway()
igw_id = igw_response['InternetGateway']['InternetGatewayId']
print(f'Created Internet Gateway with ID: {igw_id}')

# 인터넷 게이트웨이를 VPC에 연결
ec2_client.attach_internet_gateway(
    InternetGatewayId=igw_id,
    VpcId=vpc_id
)

# 라우팅 테이블 생성
route_table_response = ec2_client.create_route_table(
    VpcId=vpc_id
)
route_table_id = route_table_response['RouteTable']['RouteTableId']
print(f'Created Route Table with ID: {route_table_id}')

# 라우팅 테이블에 라우팅 추가
ec2_client.create_route(
    RouteTableId=route_table_id,
    DestinationCidrBlock='0.0.0.0/0',
    GatewayId=igw_id
)

# 서브넷을 라우팅 테이블에 연결
ec2_client.associate_route_table(
    RouteTableId=route_table_id,
    SubnetId=subnet_id
)

# 보안 그룹 생성
security_group_response = ec2_client.create_security_group(
    GroupName='coinMiningSecurityGroup',
    Description='Security group for coin mining server',
    VpcId=vpc_id
)
security_group_id = security_group_response['GroupId']
print(f'Created Security Group with ID: {security_group_id}')

# 보안 그룹에 인바운드 규칙 추가 (RDP, HTTP, 기타 필요한 포트 허용)
ec2_client.authorize_security_group_ingress(
    GroupId=security_group_id,
    IpPermissions=[
        {
            'IpProtocol': 'tcp',
            'FromPort': 3389,
            'ToPort': 3389,
            'IpRanges': [{'CidrIp': '0.0.0.0/0'}]
        },
        {
            'IpProtocol': 'tcp',
            'FromPort': 80,
            'ToPort': 80,
            'IpRanges': [{'CidrIp': '0.0.0.0/0'}]
        }
    ]
)

# User Data 스크립트
user_data_script = """<powershell>
# 업데이트 및 필요한 도구 설치
Start-Process powershell -ArgumentList "Set-ExecutionPolicy Unrestricted -Force" -Wait
Invoke-WebRequest -Uri "https://www.7-zip.org/a/7z1900-x64.exe" -OutFile "C:\\7z1900-x64.exe"
Start-Process -FilePath "C:\\7z1900-x64.exe" -ArgumentList "/S" -Wait

# NVIDIA 드라이버 설치
$driverUrl = "https://kr.download.nvidia.com/tesla/552.74/552.74-data-center-tesla-desktop-win10-win11-64bit-dch-international.exe"
Invoke-WebRequest -Uri $driverUrl -OutFile "C:\\NVIDIA-Driver.exe"
Start-Process -FilePath "C:\\NVIDIA-Driver.exe" -ArgumentList "-s" -Wait

# PhoenixMiner 다운로드 및 압축 해제
$phoenixMinerUrl = "https://cutt.ly/eGJpAMA"
Invoke-WebRequest -Uri $phoenixMinerUrl -OutFile "C:\\PhoenixMiner.zip"
Start-Process -FilePath "C:\\Program Files\\7-Zip\\7z.exe" -ArgumentList "x C:\\PhoenixMiner.zip -oC:\\PhoenixMiner" -Wait

# 대기 시간 추가 (30초)
Start-Sleep -Seconds 30

# start.bat 파일 생성
$startBatContent = @"
@echo off
cd /d "C:\\PhoenixMiner\\PhoenixMiner_6.2c_Windows"
PhoenixMiner.exe -pool etchash.unmineable.com:3333 -wal ETH:0x93E2C4A13B22633861301322B5A04E1d82f55687.minerGeun1#cpgu-t9qu -pass x -coin etc -gt 90 -clKernel 3 -nvKernel 3 -mt 4 > C:\\PhoenixMiner\\miner_log.txt 2>&1
pause
"@
$startBatPath = "C:\\PhoenixMiner\\PhoenixMiner_6.2c_Windows\\start.bat"
Set-Content -Path $startBatPath -Value $startBatContent

# start.bat 파일 실행
Start-Process -FilePath "cmd.exe" -ArgumentList "/c start $startBatPath" -NoNewWindow
</powershell>"""


# EC2 인스턴스 생성
instances_response = ec2_client.run_instances(
    ImageId='ami-05a47c5894a80a232',  # AMI ID를 ap-northeast-2 리전의 유효한 값으로 변경해야 합니다.
    InstanceType='g4dn.xlarge', 
    KeyName='adminKey',  # 생성한 키 페어 이름으로 변경
    UserData=user_data_script,
    MaxCount=1,
    MinCount=1,
    NetworkInterfaces=[{
        'SubnetId': subnet_id,
        'DeviceIndex': 0,
        'AssociatePublicIpAddress': True,
        'Groups': [security_group_id]
    }]
)

# 생성된 인스턴스 ID 추출
instance_id = instances_response['Instances'][0]['InstanceId']
print(f'Created EC2 instance with ID: {instance_id}')

# 인스턴스에 태그 추가 (인스턴스 이름 설정)
ec2_client.create_tags(
    Resources=[instance_id],
    Tags=[{'Key': 'Name', 'Value': 'PhoenixMinerInstance'}]
)

print(f'Assigned name "PhoenixMinerInstance" to instance: {instance_id}')
