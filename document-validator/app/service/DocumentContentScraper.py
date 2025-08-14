from app.utils.pdfReader import pdfContentScraper
from app.libs.prompt_generator.PromptTemplates.GramaNiladari import GramaNiladariCertification
from app.libs.prompt_generator.PromptTemplates.PHI import PHICertification

def documentContentScraper(file):

    content = pdfContentScraper(file)
    GN = PHICertification("wishwa disanayake", content, " No. 456, Main Street, Matale, Sri Lanka", "matale")
    return GN.invoker()
