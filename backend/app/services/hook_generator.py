import re


class HookGenerator:

    def generate(self, clip_text: str, beat_type: str):

        text = clip_text.strip()

        # Remove trailing punctuation for cleaner hooks
        clean = re.sub(r"[.!?]+$", "", text)

        hooks = [
            f"You're probably doing this wrong: {clean}.",
            f"Here's the problem nobody talks about: {clean}.",
            f"What if there was a faster way? {clean}.",
            f"Creators need to know this: {clean}.",
            f"The biggest mistake creators make: {clean}."
        ]

        return [
            {
                "hook_id": f"hook_{index + 1}",
                "text": hook,
                "style": style
            }
            for index, (hook, style) in enumerate([
                (hooks[0], "direct"),
                (hooks[1], "problem"),
                (hooks[2], "curiosity"),
                (hooks[3], "educational"),
                (hooks[4], "contrarian")
            ])
        ]