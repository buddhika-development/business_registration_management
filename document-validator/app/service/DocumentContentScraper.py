from app.utils.pdfReader import pdfContentScraper
from app.libs.prompt_generator.PromptSelector import promptSelector

def documentContentScraper(key ,file, data):
    content = pdfContentScraper(file)
    data["content"] = content

    conte_result = promptSelector(
        data= data,
        key= key
    )

    return conte_result.invoker()
