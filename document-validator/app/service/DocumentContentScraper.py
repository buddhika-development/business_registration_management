from app.utils.pdfReader import pdfContentScraper
from app.libs.prompt_generator.PromptSelector import promptSelector
from app.utils.s3ObjectStore import fileStore

def documentContentScraper(key ,file, data, bucket_name):
    content = pdfContentScraper(file)
    data["content"] = content

    conte_result = promptSelector(
        data= data,
        key= key
    )

    result = conte_result.invoker()
    persist_location = fileStore(file, bucket_name)

    return result,persist_location