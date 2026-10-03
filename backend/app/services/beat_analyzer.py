import re


class BeatAnalyzer:

    def analyze(self, script: str):

        sentences = re.split(
            r'(?<=[.!?])\s+',
            script.strip()
        )

        beats = []

        for index, sentence in enumerate(sentences):

            text = sentence.strip()

            if not text:
                continue

            lower = text.lower()

            if index == 0:
                beat_type = "HOOK"

            elif any(
                word in lower
                for word in [
                    "problem",
                    "waste",
                    "difficult",
                    "challenge",
                    "issue"
                ]
            ):
                beat_type = "PROBLEM"

            elif any(
                word in lower
                for word in [
                    "solve",
                    "solution",
                    "platform",
                    "introduces",
                    "brings"
                ]
            ):
                beat_type = "SOLUTION"

            elif any(
                word in lower
                for word in [
                    "benefit",
                    "helps",
                    "allows",
                    "can",
                    "faster"
                ]
            ):
                beat_type = "BENEFIT"

            elif any(
                word in lower
                for word in [
                    "finally",
                    "follow",
                    "subscribe",
                    "try",
                    "today"
                ]
            ):
                beat_type = "CTA"

            else:
                beat_type = "INSIGHT"

            beats.append({
                "beat_id": f"beat_{index + 1}",
                "beat_type": beat_type,
                "text": text,
                "order_index": index
            })

        return beats