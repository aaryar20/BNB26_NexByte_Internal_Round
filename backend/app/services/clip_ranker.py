class ClipRanker:

    def rank(self, matches):
        clips = []

        for match in matches:
            if not match["candidates"]:
                continue

            best = match["candidates"][0]

            duration = best["end"] - best["start"]
            semantic_score = best["similarity"]

            beat_importance = self.beat_importance(
                match["beat_type"]
            )

            hook_strength = self.hook_strength(
                best["text"],
                match["beat_type"]
            )

            context_score = self.context_score(
                best["text"]
            )

            duration_score = self.duration_score(
                duration
            )

            final_score = (
                semantic_score * 0.35
                + beat_importance * 0.20
                + hook_strength * 0.20
                + context_score * 0.15
                + duration_score * 0.10
            )

            clips.append({
                "beat_id": match["beat_id"],
                "beat_type": match["beat_type"],
                "start": best["start"],
                "end": best["end"],
                "duration": round(duration, 2),

                "semantic_score": round(semantic_score, 4),
                "beat_importance": round(beat_importance, 4),
                "hook_strength": round(hook_strength, 4),
                "context_score": round(context_score, 4),
                "duration_score": round(duration_score, 4),

                "score": round(final_score, 4),

                "source_text": best["text"]
            })

        clips.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return clips

    # -----------------------------------------
    # BEAT IMPORTANCE
    # -----------------------------------------

    def beat_importance(self, beat_type):
        scores = {
            "HOOK": 1.00,
            "PROBLEM": 0.95,
            "SOLUTION": 0.90,
            "BENEFIT": 0.85,
            "CTA": 0.75,
            "INSIGHT": 0.70
        }

        return scores.get(beat_type, 0.60)

    # -----------------------------------------
    # HOOK STRENGTH
    # -----------------------------------------

    def hook_strength(self, text, beat_type):
        text_lower = text.lower()

        score = 0.40

        hook_words = [
            "why",
            "how",
            "what",
            "biggest",
            "problem",
            "mistake",
            "waste",
            "secret",
            "important",
            "actually",
            "never",
            "instead",
            "finally"
        ]

        for word in hook_words:
            if word in text_lower:
                score += 0.05

        if beat_type == "HOOK":
            score += 0.25

        if beat_type == "PROBLEM":
            score += 0.15

        return min(score, 1.0)

    # -----------------------------------------
    # STANDALONE CONTEXT
    # -----------------------------------------

    def context_score(self, text):
        words = text.split()

        if len(words) < 5:
            return 0.40

        if len(words) < 10:
            return 0.65

        if len(words) < 25:
            return 0.90

        return 0.80

    # -----------------------------------------
    # DURATION
    # -----------------------------------------

    def duration_score(self, duration):

        if 15 <= duration <= 45:
            return 1.00

        if 10 <= duration < 15:
            return 0.85

        if 45 < duration <= 60:
            return 0.80

        if 6 <= duration < 10:
            return 0.75

        if duration < 6:
            return 0.50

        return 0.60