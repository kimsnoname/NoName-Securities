import boto3
import argparse
import time

def main(instance_id):
    # AWS 클라이언트 초기화
    ec2_client = boto3.client('ec2', region_name='ap-northeast-2')

    # 인스턴스 중지
    print(f'Stopping instance {instance_id}...')
    ec2_client.stop_instances(InstanceIds=[instance_id])
    waiter = ec2_client.get_waiter('instance_stopped')
    waiter.wait(InstanceIds=[instance_id])
    print(f'Instance {instance_id} stopped.')

    # 인스턴스 타입 변경
    print(f'Changing instance type to g4dn.xlarge...')
    ec2_client.modify_instance_attribute(
        InstanceId=instance_id,
        InstanceType={'Value': 'g4dn.xlarge'}
    )

    # 인스턴스 시작
    print(f'Starting instance {instance_id}...')
    ec2_client.start_instances(InstanceIds=[instance_id])
    waiter = ec2_client.get_waiter('instance_running')
    waiter.wait(InstanceIds=[instance_id])
    print(f'Instance {instance_id} is now running.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Change the instance type of an EC2 instance.')
    parser.add_argument('instance_id', type=str, help='The ID of the EC2 instance to modify.')
    
    args = parser.parse_args()
    main(args.instance_id)
