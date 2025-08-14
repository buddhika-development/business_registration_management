from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()


def GeminiConnection():
    """
    Gemini LMM connection

    this class create the connection between application and the gemini ai model
    """

    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.7
        )
        return llm

    except Exception as e:
        print("Something went wrong in the llm connection")
        return None