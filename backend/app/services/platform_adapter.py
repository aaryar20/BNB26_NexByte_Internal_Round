class PlatformAdapter:

    PLATFORM_RULES = {
        "instagram": {
            "aspect_ratio": "9:16",
            "max_duration": 90,
            "caption_style": "dynamic",
            "tone": "engaging"
        },
        "youtube_shorts": {
            "aspect_ratio": "9:16",
            "max_duration": 60,
            "caption_style": "clear",
            "tone": "curiosity_driven"
        },
        "linkedin": {
            "aspect_ratio": "1:1",
            "max_duration": 90,
            "caption_style": "professional",
            "tone": "professional"
        }
    }

    def adapt_clip(self, clip):
        adaptations = []

        for platform, rules in self.PLATFORM_RULES.items():

            text = clip["source_text"].strip()

            if platform == "instagram":
                adaptation = {
                    "platform": platform,
                    "aspect_ratio": rules["aspect_ratio"],
                    "max_duration": rules["max_duration"],
                    "caption_style": rules["caption_style"],
                    "caption": self.instagram_caption(text),
                    "hashtags": self.generate_hashtags(text),
                    "tone": rules["tone"]
                }

            elif platform == "youtube_shorts":
                adaptation = {
                    "platform": platform,
                    "aspect_ratio": rules["aspect_ratio"],
                    "max_duration": rules["max_duration"],
                    "caption_style": rules["caption_style"],
                    "title": self.youtube_title(text),
                    "description": self.youtube_description(text),
                    "tone": rules["tone"]
                }

            elif platform == "linkedin":
                adaptation = {
                    "platform": platform,
                    "aspect_ratio": rules["aspect_ratio"],
                    "max_duration": rules["max_duration"],
                    "caption_style": rules["caption_style"],
                    "caption": self.linkedin_caption(text),
                    "tone": rules["tone"]
                }

            adaptations.append(adaptation)

        return adaptations

    def instagram_caption(self, text):
        return f"Creators need to know this: {text}"

    def youtube_title(self, text):
        clean_text = text.rstrip(".!?")
        if len(clean_text) > 70:
            clean_text = clean_text[:67] + "..."
        return clean_text

    def youtube_description(self, text):
        return (
            f"{text}\n\n"
            "Created with CreatorAi."
        )

    def linkedin_caption(self, text):
        return (
            f"{text}\n\n"
            "A smarter content workflow can reduce repetitive work "
            "and give creators more time to focus on creating."
        )

    def generate_hashtags(self, text):
        return [
            "#CreatorAi",
            "#ContentCreation",
            "#CreatorEconomy",
            "#AICreator"
        ]