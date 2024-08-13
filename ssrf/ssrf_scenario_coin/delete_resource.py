import boto3
import argparse
from botocore.exceptions import ClientError

def delete_resources(vpc_id):
    ec2_client = boto3.client('ec2', region_name='ap-northeast-2')

    try:
        # EC2 인스턴스 검색 및 종료
        instances = ec2_client.describe_instances(Filters=[{'Name': 'vpc-id', 'Values': [vpc_id]}])
        instance_ids = [instance['InstanceId'] for reservation in instances['Reservations'] for instance in reservation['Instances']]
        
        if instance_ids:
            ec2_client.terminate_instances(InstanceIds=instance_ids)
            waiter = ec2_client.get_waiter('instance_terminated')
            waiter.wait(InstanceIds=instance_ids)
            print(f'Terminated instances: {instance_ids}')

        # 보안 그룹 검색 및 삭제
        security_groups = ec2_client.describe_security_groups(Filters=[{'Name': 'vpc-id', 'Values': [vpc_id]}])
        for sg in security_groups['SecurityGroups']:
            if sg['GroupName'] != 'default':  # 기본 보안 그룹 제외
                ec2_client.delete_security_group(GroupId=sg['GroupId'])
                print(f'Deleted security group: {sg["GroupId"]}')
        
        # 서브넷 검색 및 삭제
        subnets = ec2_client.describe_subnets(Filters=[{'Name': 'vpc-id', 'Values': [vpc_id]}])
        subnet_ids = [subnet['SubnetId'] for subnet in subnets['Subnets']]
        
        for subnet_id in subnet_ids:
            ec2_client.delete_subnet(SubnetId=subnet_id)
            print(f'Deleted subnet: {subnet_id}')

        # 인터넷 게이트웨이 검색 및 삭제
        igws = ec2_client.describe_internet_gateways(Filters=[{'Name': 'attachment.vpc-id', 'Values': [vpc_id]}])
        for igw in igws['InternetGateways']:
            ec2_client.detach_internet_gateway(InternetGatewayId=igw['InternetGatewayId'], VpcId=vpc_id)
            ec2_client.delete_internet_gateway(InternetGatewayId=igw['InternetGatewayId'])
            print(f'Deleted internet gateway: {igw["InternetGatewayId"]}')
        
        # 라우팅 테이블 검색 및 삭제
        route_tables = ec2_client.describe_route_tables(Filters=[{'Name': 'vpc-id', 'Values': [vpc_id]}])
        for rt in route_tables['RouteTables']:
            if not rt['Associations']:
                ec2_client.delete_route_table(RouteTableId=rt['RouteTableId'])
                print(f'Deleted route table: {rt["RouteTableId"]}')
            else:
                for assoc in rt['Associations']:
                    if not assoc['Main']:  # 메인 라우팅 테이블은 삭제하지 않음
                        ec2_client.disassociate_route_table(AssociationId=assoc['RouteTableAssociationId'])
                        ec2_client.delete_route_table(RouteTableId=rt['RouteTableId'])
                        print(f'Deleted route table: {rt["RouteTableId"]}')
        
        # VPC 삭제
        ec2_client.delete_vpc(VpcId=vpc_id)
        print(f'Deleted VPC: {vpc_id}')
    
    except ClientError as e:
        print(f'Error: {e}')

def main():
    parser = argparse.ArgumentParser(description='Delete AWS resources associated with a VPC.')
    parser.add_argument('vpc_id', type=str, help='The ID of the VPC to delete.')
    
    args = parser.parse_args()
    vpc_id = args.vpc_id
    
    delete_resources(vpc_id)

if __name__ == '__main__':
    main()
