from langchain_core.prompts import PromptTemplate
from app.libs.llm_connection.Gemini import GeminiConnection
from pydantic import BaseModel
from app.libs.prompt_generator.Prompt import Prompt
from datetime import date

class AffidavitCertificateDetails(BaseModel):
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

class AffidavitCertification(Prompt):

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
        AFFIDAVIT_VALIDATION_PROMPT = """
        You are a quick checker for affidavits used in business registration.

        INPUT
        - RAW_TEXT: {document_text}
        - EXPECTED_NAME (optional): {expected_name}
        - EXPECTED_ADDRESS (optional): {expected_address}
        - TODAY: {today}

        CHECKS (keep it simple)
        1) Affidavit nature: The text clearly shows an oath/affirmation (e.g., “affidavit”, “swear”, “solemnly affirm/declare”)
           and it is sworn before an authorized officer (Commissioner for Oaths / Justice of the Peace / Notary / Magistrate).
        2) Core clause present (or close paraphrase) and internally consistent, including the GIVEN DATA:
           "I, <NAME>, resident of <ADDRESS>, do hereby solemnly and respectfully swear/declare as a <CAPACITY> that all the
           information in the application or declaration submitted by me as per the <STATUTE> Statute is true and accurate
           to the best of my knowledge and belief."
           Minor wording changes are fine; meaning must match.
        3) Identity fields: Extract NAME and ADDRESS. If EXPECTED_* provided, compare loosely (case-insensitive, ignore extra spaces/punctuation).
        4) Capacity/role: Extract CAPACITY (e.g., proprietor/partner/director/authorized signatory). If EXPECTED_CAPACITY provided, compare loosely.
        5) Statute reference: Extract the cited STATUTE/Ordinance/Act. If EXPECTED_STATUTE provided, compare loosely.
        6) Date & attestations: Find date/place of swearing and both signatures (deponent + attesting officer) or officer’s seal/stamp.
           If officer attestation is missing → not acceptable.
        7) Language handling: Accept Sinhala/Tamil equivalents; mentally translate.
        8) If any critical element (affidavit nature, core clause meaning with given data, identity, attestation/date) is missing or contradictory,
           treat the affidavit as not acceptable.
        """

        prompt_template = PromptTemplate.from_template(AFFIDAVIT_VALIDATION_PROMPT)
        self.llm_prompt = prompt_template.invoke({
            "expected_name" : self.name,
            "document_text" : self.letter_content,
            "expected_address" : self.address,
            "today" : date.today()
        })

    def prompt_executor(self):

        structured_llm = llm.with_structured_output(AffidavitCertificateDetails)
        structured_llm_output = structured_llm.invoke(self.llm_prompt)
        return structured_llm_output