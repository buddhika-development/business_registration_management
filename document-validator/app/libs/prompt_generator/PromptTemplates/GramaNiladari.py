from langchain_core.prompts import PromptTemplate
from app.libs.llm_connection.Gemini import GeminiConnection
from pydantic import BaseModel
from app.libs.prompt_generator.Prompt import Prompt
from datetime import date

class GramaNiladariCertificateDetails(BaseModel):
    """
    structure of the output

    This Class define which kind of output need to be occur through the llm execution process
    """

    document_validity : bool
    reason_for_success_or_false : str
    gramasewaka_name : str
    email : str
    date : str

llm = GeminiConnection()

class GramaNiladariCertification(Prompt):

    ""

    def __init__(self, name, content):
        self.llm_prompt = None
        self.name = name
        self.letter_content = content

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

        GN_VALIDATION_PROMPT = """
        You are a strict validator for Sri Lankan Grama Niladhari (GN) certificates related to citizenship.
        Assess validity and extract: full name, email (if any), and issuance date (normalize to YYYY-MM-DD).

        INPUT
        - RAW_TEXT: {document_text}
        - EXPECTED_NAME (optional): {expected_name}
        - TODAY: {today}

        VALIDATION RULES (apply all)
        1) The text must clearly confirm the person is a citizen of Sri Lanka (e.g., “Sri Lankan citizen,” “citizen of Sri Lanka,” or Sinhala/Tamil equivalents). If not clearly stated → invalid.
        2) The document must be issued by a Grama Niladhari or Divisional Secretariat (look for “Grama Niladhari,” “GN Division,” “Divisional Secretariat,” seals/stamps/signatures). If issuer cues are missing → invalid.
        3) There must be an issuance date. Extract it and convert to ISO (YYYY-MM-DD). If no date is present → invalid. If the date is older than 6 months from TODAY → invalid. If multiple dates are present, select the one near “Issued on/Date/Certified on”.
        4) Extract the person’s full name. If EXPECTED_NAME is provided, compare case-insensitively and ignore extra spaces/periods/initials; a clear mismatch → invalid. If multiple candidate names appear, choose the one near “Name/Full Name/Applicant”.
        5) Extract any email present. If EXPECTED_EMAIL is provided and differs, still extract the email found in the certificate.
        6) If any required element is ambiguous or missing, treat the certificate as invalid.

        NOTES
        - For Sinhala/Tamil, mentally translate and apply the same rules.
        - A valid certificate may lack an email; absence of email alone does not invalidate.
        - When uncertain on any required element, err on the side of invalid.
        """

        prompt_template = PromptTemplate.from_template(GN_VALIDATION_PROMPT)
        self.llm_prompt = prompt_template.invoke({
            "expected_name" : self.name,
            "document_text" : self.letter_content,
            "today" : date.today()
        })

    def prompt_executor(self):

        structured_llm = llm.with_structured_output(GramaNiladariCertificateDetails)
        structured_llm_output = structured_llm.invoke(self.llm_prompt)
        return structured_llm_output