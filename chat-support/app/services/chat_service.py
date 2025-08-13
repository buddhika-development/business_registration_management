from app.libs.llm_connection.gemini_connection import GeminiConnection

llm = GeminiConnection()

def generate_response(query):
    response = llm.invoke(query)
    return {
        "content" : response
    },200