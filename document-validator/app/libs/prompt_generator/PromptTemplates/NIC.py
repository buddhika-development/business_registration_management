from langchain_core.prompts import PromptTemplate
from app.libs.llm_connection.Gemini import GeminiConnection
from pydantic import BaseModel
from app.libs.prompt_generator.Prompt import Prompt
from datetime import date

class NICCertificateDetails(BaseModel):
    """
    structure of the output

    This Class define which kind of output need to be occur through the llm execution process
    """

    document_validity : bool
    reason_for_success_or_false : str
    nic_number : str

llm = GeminiConnection()

class NICCertification(Prompt):

    def __init__(self, name, content):
        self.llm_prompt = None
        self.name = name
        self.content = content

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
        NIC_VALIDATION_PROMPT = """
        You are a quick checker for Sri Lankan National Identity Card (NIC) numbers.

        INPUT
        - NIC_CONTENT: {nic_content}
        - TODAY: {today}
        - EXPECTED_name (optional): {name}

        GUIDELINES
            A) Ignore non-data: watermarks, app names, device/brand names, headers/footers, and scanner logos
               such as "CamScanner", "Adobe Scan", "Microsoft Lens/Office Lens", "HP Smart", "Canon/Epson",
               “Scanned by…”, “COPY”, “Page …”, timestamps, etc. These must never be mistaken for NICs.
            
            B) Candidate extraction:
               - New NIC: 12 digits, allowing spaces or hyphens between groups
                 (e.g., 199912312345, 1999 123 123 456, 1999-123-123-456).
               - Old NIC: 9 digits followed by V or X (case-insensitive), spaces/hyphens allowed before the letter
                 (e.g., 88 1234567 V, 881234567v).
               - Ignore digit runs embedded in longer numbers unless clearly separated or near labels like
                 “NIC”, “ID No.”, “National Identity Card”.
            
            C) Normalization: remove spaces and hyphens; uppercase any trailing letter. The normalized candidate must be
               exactly 12 digits OR 9 digits plus [V|X].
            
            D) Validation logic:
               1) Year:
                  - 12-digit → YYYY is the first 4 digits (reasonable range 1900–2099).
                  - 10-char → map YY to 1900+YY; if that makes age < 16 on TODAY, use 2000+YY.
               2) Day-of-year (DDD):
                  - Male: 001–366. Female: 501–866 (subtract 500).
                  - 000 or >866 → invalid. If (adjusted) 366 → valid only in leap years.
               3) Gender: DDD ≥ 500 → female; otherwise male.
               4) Date of birth: derive from YYYY + adjusted DDD; age on TODAY must be 16–130 inclusive.
               5) Optional consistency: if EXPECTED_DOB or EXPECTED_GENDER are provided, they must match the derived values.
            
            E) Multiple hits: If several valid NICs are present, prefer one closest to labels (“NIC/ID No.”) or the first
            top-left occurrence in reading order.
            
            F) Language: Apply the same rules for Sinhala/Tamil/English labels and wording.
            
            G) If no candidate passes validation after ignoring watermarks/logos, treat as “no valid NIC found in the text”.
        """

        prompt_template = PromptTemplate.from_template(NIC_VALIDATION_PROMPT)
        self.llm_prompt = prompt_template.invoke({
            "nic_content" : self.content,
            "name" : self.name,
            "today" : date.today()
        })

    def prompt_executor(self):

        structured_llm = llm.with_structured_output(NICCertificateDetails)
        structured_llm_output = structured_llm.invoke(self.llm_prompt)
        return structured_llm_output