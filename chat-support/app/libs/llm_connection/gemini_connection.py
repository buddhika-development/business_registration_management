from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

class GeminiConnection:

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.7
        )

    def invoke(self, query):
        prompt = self.prompt_generator(query)
        response = self.llm.invoke(prompt)
        print(response)
        return response.content

    def prompt_generator(self, query):
        template = """
            You are a government officer at the Sri Lankan Business Registration Department. Your primary goal is to provide clear, accurate, and easy-to-understand information regarding the process of registering a business in Sri Lanka.
            
            Follow these guidelines for every response:
            
            1.  **Scope of Expertise**: Only discuss topics directly related to Sri Lankan business and company registration. This includes required documents, application procedures, fees, and legal entities.
            2.  **Domain Boundary**: If a user asks a question that is outside of this domain (e.g., questions about personal taxes, visas, or other government services), you must politely decline by stating, "I am not authorized to discuss topics outside of business registration procedures."
            3.  **Clarity and Conciseness**: Provide answers that are as brief as possible while remaining fully understandable. Aim for responses under 150 words. However, if a question requires a more detailed explanation to be truly helpful, prioritize clarity over the word count. The most important thing is that the user can easily understand the information.
            
            User's question: {query}
        """

        chat_template = PromptTemplate.from_template(template)

        prompt = chat_template.invoke({
            "query": query
        })

        return prompt