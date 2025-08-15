import boto3
import os
from botocore.exceptions import ClientError
from datetime import datetime
from flask import current_app

def s3Connection():

    try:

        s3_client = boto3.client(
            service_name = 's3',
            region_name = current_app.config["AWS_ORIGIN"],
            aws_access_key_id = current_app.config["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key = current_app.config["AWS_SECRET_ACCESS_KEY"]
        )

        return  s3_client

    except Exception as e:
        print(f"Something went wrong in s3 connection creation process... {e}")


def fileStore(file, bucket_name):

    s3 = s3Connection()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"{file.name}_{timestamp}"
    file_path= f"/document/{file_name}"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(file.read())

    try:
        s3.upload_file(
            Filename= file_path,
            Bucket= bucket_name,
            Key = file_name
        )
        ...
    except Exception as e:
        print(f"Something went wrong in file storing process.. {e}")