from app.libs.llm_connection.gemini_connection import GeminiConnection

llm = GeminiConnection()

def generate_response(query, history):
    response = llm.invoke(query, history)
    return {
        "content" : response
    },200