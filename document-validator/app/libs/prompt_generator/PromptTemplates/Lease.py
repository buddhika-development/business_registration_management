from langchain_core.prompts import PromptTemplate
from app.libs.llm_connection.Gemini import GeminiConnection
from pydantic import BaseModel
from app.libs.prompt_generator.Prompt import Prompt
from datetime import date

class LeaseCertificateDetails(BaseModel):
    """
    structure of the output

    This Class define which kind of output need to be occur through the llm execution process
    """

    document_validity : bool
    reason_for_success_or_false : str
    name : str
    email : str
    date : str

llm = GeminiConnection()

class LeastCertification(Prompt):

    ""

    def __init__(self, name, content, address):
        self.llm_prompt = None
        self.name = name
        self.letter_content = content
        self.address = address

    def invoker(self):
        """
        Handle the scenario

        This function is responsible for execute the whole sceanrio step by step and return the structured output as result
        -> create relevent prompt
        -> generate output

        :return:
        structured outputc
        """
        self.prompt_generator()
        result = self.prompt_executor()
        return  result

    def prompt_generator(self):
        PROPERTY_LEASE_VALIDATION_PROMPT = """
        You are a quick checker for property lease/tenancy agreements used in business registration
        to confirm that the applicant has a valid, current right to occupy the premises.

        INPUT
        - RAW_TEXT: {document_text}
        - EXPECTED_LESSEE (optional): {expected_lessee}
        - EXPECTED_ADDRESS (optional): {expected_address}
        - TODAY: {today}

        CHECKPOINTS (keep it simple)
        1) Parties: Clearly names the LESSOR/landlord and LESSEE/tenant. If EXPECTED_LESSEE is provided, compare loosely
           (case-insensitive, ignore extra spaces). Big mismatch → different party.
        2) Premises: Clear property/premises address (lot/door number, street, town). If EXPECTED_ADDRESS is provided,
           compare loosely. Big mismatch → different place.
        3) Term & currency: Shows a start/commencement date and either an end date or a duration (e.g., 1 year).
           - If missing → unreliable.
           - If TODAY is after the end date (or beyond the stated duration) → not current.
        4) Rent & frequency: Mentions rent amount and payment frequency (e.g., monthly). Note any refundable deposit.
           (Absence of deposit is fine.)
        5) Use: States or implies permission to use the premises for business/commerce (shop/office/restaurant/etc.).
           If the document restricts to residential-only use that conflicts with business registration → not acceptable.
        6) Signatures: Signature or name of both landlord and tenant with date. Prefer presence of witnesses/notary/stamp; 
           if both party signatures are missing → not acceptable.
        7) Termination/renewal cues: If it says the lease is terminated/expired/not renewed before TODAY → not current.
        8) Language: Accept Sinhala/Tamil/English wording; interpret equivalents.
        9) Ambiguity rule: If any critical element (parties, premises, term dates, signatures) is missing or unclear,
           treat the lease as not acceptable for proving occupancy.
        """

        prompt_template = PromptTemplate.from_template(PROPERTY_LEASE_VALIDATION_PROMPT)
        self.llm_prompt = prompt_template.invoke({
            "expected_lessee" : self.name,
            "document_text" : self.letter_content,
            "expected_address" : self.address,
            "today" : date.today()
        })

    def prompt_executor(self):

        structured_llm = llm.with_structured_output(LeaseCertificateDetails)
        structured_llm_output = structured_llm.invoke(self.llm_prompt)
        return structured_llm_output