from langchain_core.prompts import PromptTemplate
from app.libs.llm_connection.Gemini import GeminiConnection
from pydantic import BaseModel
from app.libs.prompt_generator.Prompt import Prompt
from datetime import date

class PHICertificateDetails(BaseModel):
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

class PHICertification(Prompt):

    ""

    def __init__(self, name, content, address, moh_area):
        self.llm_prompt = None
        self.name = name
        self.letter_content = content
        self.address = address
        self.moh_area = moh_area

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
        PHI_VALIDATION_PROMPT = """
        You are a quick checker for Sri Lankan PHI (Public Health Inspector) certificates used during business registration
        to judge whether a food place/goods appear hygienic and acceptable.

        INPUT
        - RAW_TEXT: {document_text}
        - EXPECTED_ADDRESS (optional): {expected_address}
        - EXPECTED_OWNER (optional): {expected_owner}
        - EXPECTED_MOH_AREA (optional): {expected_moh_area}
        - TODAY: {today}

        CHECKPOINTS (keep it simple)
        1) Issuer: Mentions PHI / MOH / Local Authority and shows a sign/stamp cue. If missing → treat as unreliable.
        2) Purpose: Clearly about food premises hygiene/fitness/clearance (not some other topic).
        3) Date freshness: Find issue/inspection date.
           - If missing → unreliable.
           - If expired → not current.
           - If no expiry, older than 12 months from TODAY → not current.
        4) Outcome: Look for a clear positive result (approved / pass / satisfactory / grade A–C / cleared).
           - If fail / reject / suspend / pending re-inspection → not acceptable.
        5) Place match: Extract establishment name/address; if EXPECTED_* given, compare loosely
           (case-insensitive, ignore extra spaces). Big mismatch → different place.
        6) Area match: MOH/Local Authority area is compatible with the address and EXPECTED_MOH_AREA (if provided).
        7) Conditions: Note limits (e.g., “pre-packed only”, “no cooking”). If they contradict intended use → not acceptable.
        8) Language: Apply same rules for Sinhala/Tamil wording.

        Goal: simple go/no-go impression — reliable issuer + correct purpose + current date + positive outcome + consistent place/area.
        """

        prompt_template = PromptTemplate.from_template(PHI_VALIDATION_PROMPT)
        self.llm_prompt = prompt_template.invoke({
            "expected_owner" : self.name,
            "document_text" : self.letter_content,
            "expected_address" : self.address,
            "expected_moh_area" : self.moh_area,
            "today" : date.today()
        })

    def prompt_executor(self):

        structured_llm = llm.with_structured_output(PHICertificateDetails)
        structured_llm_output = structured_llm.invoke(self.llm_prompt)
        return structured_llm_output