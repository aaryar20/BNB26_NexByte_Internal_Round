class EditPlanner:

    def create_plan(self, clip):
        start = clip["start"]
        end = clip["end"]

        return {
            "clip_id": clip["clip_id"],

            "source": {
                "start": start,
                "end": end
            },

            "operations": [
                {
                    "id": "edit_001",
                    "type": "trim",
                    "start": start,
                    "end": end,
                    "status": "ai_suggested"
                },
                {
                    "id": "edit_002",
                    "type": "captions",
                    "style": "dynamic",
                    "status": "ai_suggested"
                },
                {
                    "id": "edit_003",
                    "type": "aspect_ratio",
                    "value": "9:16",
                    "status": "ai_suggested"
                }
            ]
        }