import boto3

client = boto3.client('support')

response = client.create_case(
    subject='Request to increase EC2 instance limit',
    serviceCode='ec2',
    categoryCode='instance-limit',
    severityCode='urgent',
    communicationBody='Please increase the vCPU limit for the instance type g4dn.2xlarge in the ap-northeast-2 region.',
    issueType='service-limit-increase',
    language='en'
)

print(response)
