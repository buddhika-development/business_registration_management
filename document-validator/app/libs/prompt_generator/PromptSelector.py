from app.libs.prompt_generator.PromptTemplates.GramaNiladari import GramaNiladariCertification
from app.libs.prompt_generator.PromptTemplates.Lease import LeastCertification
from app.libs.prompt_generator.PromptTemplates.Affidavit import AffidavitCertification
from app.libs.prompt_generator.PromptTemplates.PHI import PHICertification
from app.libs.prompt_generator.PromptTemplates.NIC import NICCertification

def promptSelector(key, data):
    validator = None

    if key == "gnc":
        validator = GramaNiladariCertification(data["name"], data["content"])
    elif key == "lease":
        validator = LeastCertification(data["name"], data["content"], data["address"])
    elif key == "affidavit":
        validator = AffidavitCertification(data["name"], data["content"], data["address"])
    elif key == "phi":
        validator = PHICertification(data["name"], data["content"], data["address"], data["moh_area"])
    elif key == "nic":
        validator = NICCertification(data["name"], data["content"])

    return validator