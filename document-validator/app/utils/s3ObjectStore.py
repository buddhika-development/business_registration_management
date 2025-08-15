import boto3
import os
from botocore.exceptions import ClientError
from datetime import datetime
from flask import current_app

def s3Connection():
    """
    Connect to s3 bucket

    This function is responsible for make connection with the aws s3 bucket service relevent to the specific user and set of user rules

    :return:
        s3 client -> access the services and further processes
    """
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
    """
    Store object in s3 bucket

    This function is responsible for store the given document into the given specific bucket and return the stored link for further processes.

    :param file: what is the file need to store in the s3 bucket
    :param bucket_name: what is the bucket need to store that relevent file objec

    :return:
        object link
    """

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

        object_url = f"https://{bucket_name}.s3.{current_app.config['AWS_ORIGIN']}.amazonaws.com/{file_name}"
        return object_url

    except Exception as e:
        print(f"Something went wrong in file storing process.. {e}")
        return None