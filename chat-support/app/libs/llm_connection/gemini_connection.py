from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
import json

load_dotenv()

class GeminiConnection:
    """
    Gemini LLM connection
    """

    def __init__(self):
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                temperature=0.7,
            )
        except Exception as e:
            print("Something went wrong in the llm connection:", e)

        # Build the prompt template ONCE
        system_instructions = (
            "You are a government officer at the Sri Lankan Business Registration Department. "
            "Your job is to provide clear, accurate, easy-to-understand information about Sri Lankan "
            "business/company registration.\n\n"
            "STRICT OUTPUT FORMAT (HTML):\n"
            "- Return VALID HTML using ONLY these tags: <p>, <ul>, <ol>, <li>, <a>.\n"
            "- DO NOT use any other tags (no <div>, <span>, <h1-6>, <br>, <code>, <img>, etc.).\n"
            "- NO inline CSS, NO class/id attributes, NO scripts.\n"
            "- Keep paragraphs in <p>. Use lists (<ul>/<ol>) for steps. Use <a href=\"...\">text</a> for links.\n"
            "- If a question is outside business registration scope, reply with a single <p>I am not authorized to discuss topics outside of business registration procedures.</p>\n"
            "- Keep answers concise (aim < 150 words) unless more detail is required for clarity.\n"
        )

        # Only two variables: history_block and query
        self.prompt_template = PromptTemplate(
            input_variables=["history_block", "query"],
            template=(
                "{system}\n\n"
                "Conversation so far:\n"
                "{history_block}\n\n"
                "User: {query}\n"
                "Assistant (HTML, only <p>, <ul>, <ol>, <li>, <a>):"
            ),
            partial_variables={"system": system_instructions},
        )

    def _coerce_history(self, history):
        """
        Accepts history as a Python list OR a JSON string.
        Returns a Python list of message dicts: [{role: 'user'|'bot', text: '...'}, ...]
        """
        if not history:
            return []
        if isinstance(history, list):
            return history
        if isinstance(history, str):
            try:
                return json.loads(history)
            except json.JSONDecodeError:
                return []
        # Unknown type
        return []

    def _format_history_block(self, history_list):
        """
        Turn history list into plain text lines without braces, so templates are safe.
        """
        if not history_list:
            return "(no prior messages)"
        lines = []
        for m in history_list:
            role = m.get("role", "user")
            text = m.get("text", "")
            who = "Assistant" if role in ("bot", "assistant", "ai") else "User"
            lines.append(f"{who}: {text}")
        return "\n".join(lines)

    def prompt_generator(self, query, history):
        """
        Build a SAFE prompt with only known placeholders.
        """
        history_list = self._coerce_history(history)
        history_block = self._format_history_block(history_list)
        # Format the template with query + history_block only
        return self.prompt_template.format(
            history_block=history_block,
            query=query,
        )

    def invoke(self, query, history=""):
        """
        Generate output using the LLM.
        """
        prompt = self.prompt_generator(query, history)
        # ChatGoogleGenerativeAI can accept a string; it will wrap it as a HumanMessage
        response = self.llm.invoke(prompt)
        # Some providers return structured content; ensure string
        return getattr(response, "content", str(response))
