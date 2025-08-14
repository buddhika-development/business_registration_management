from app.libs.prompt_generator.PromptTemplates.NIC import NICCertification
from app.utils.pdfReader import pdfContentScraper
from app.libs.prompt_generator.PromptTemplates.GramaNiladari import GramaNiladariCertification
from app.libs.prompt_generator.PromptTemplates.PHI import PHICertification
from app.libs.prompt_generator.PromptTemplates.Affidavit import AffidavitCertification
from app.libs.prompt_generator.PromptTemplates.Lease import LeastCertification

def documentContentScraper(file):

    content = pdfContentScraper(file)
    # GN = PHICertification("wishwa disanayake", content, " No. 456, Main Street, Matale, Sri Lanka", "matale")
    # GN = AffidavitCertification("wishwa disanayake", content, "No. 456, Main Street, Matale, Sri Lanka")
    # GN = LeastCertification("wishwa disanayake",content,"No. 456, Main Street, Matale, Sri Lanka"  )
    GN = NICCertification("PARANAGAMA WIDANELAGE KAVINDU DULSARA MANAKAL PARANAGAMA", content,)

    return GN.invoker()
