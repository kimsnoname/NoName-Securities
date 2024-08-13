import boto3
import time
import re
import argparse

# AWS 클라이언트 생성
ssm_client = boto3.client('ssm', region_name='ap-northeast-2')

def get_log_content(instance_id, log_file_path):
    # 원격 명령 실행 (로그 파일 내용 확인)
    response = ssm_client.send_command(
        InstanceIds=[instance_id],
        DocumentName="AWS-RunPowerShellScript",
        Parameters={'commands': [f'Get-Content {log_file_path}']}
    )

    # 명령 ID 추출
    command_id = response['Command']['CommandId']

    # 명령 결과 확인 (명령이 완료될 때까지 대기)
    time.sleep(10)  # 잠시 대기 후 결과 확인

    output = ssm_client.get_command_invocation(
        CommandId=command_id,
        InstanceId=instance_id,
    )

    return output['StandardOutputContent']

def extract_ltc_address(log_content):
    # 정규 표현식을 사용하여 LTC 주소 추출
    ltc_address = re.search(r'ltc1[0-9a-zA-Z]{39,59}', log_content)
    if ltc_address:
        return ltc_address.group()
    else:
        return 'LTC Address not found in the log file.'

def main():
    parser = argparse.ArgumentParser(description='Check PhoenixMiner LTC address on an EC2 instance.')
    parser.add_argument('instance_id', type=str, help='The ID of the EC2 instance.')
    parser.add_argument('--log_file', type=str, default='C:\\phoenixminer\\PhoenixMiner.log', help='The path to the PhoenixMiner log file.')

    args = parser.parse_args()

    instance_id = args.instance_id
    log_file_path = args.log_file

    print(f'Checking LTC address on instance {instance_id}...')

    try:
        log_content = get_log_content(instance_id, log_file_path)
        ltc_address = extract_ltc_address(log_content)
        print(f'LTC Address: {ltc_address}')
    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    main()
