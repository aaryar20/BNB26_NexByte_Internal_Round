import json
import os

from openai import OpenAI


class ScriptAnalyzer:

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY is not configured"
            )

        self.client = OpenAI(
            api_key=api_key
        )

    def analyze(self, script: str):

        prompt = f"""
You are a content structure analyzer.

Analyze the following creator script and divide it
into meaningful content beats.

For every beat return:

- beat_type
- text
- purpose
- order_index

Allowed beat types:

HOOK
INTRO
PROBLEM
INSIGHT
EXAMPLE
SOLUTION
BENEFIT
CTA
OTHER

Return ONLY valid JSON.

Script:

{script}
"""

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.2,
            response_format={
                "type": "json_object"
            },
            messages=[
                {
                    "role": "system",
                    "content": "You analyze creator scripts."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        content = response.choices[0].message.content

        return json.loads(content)