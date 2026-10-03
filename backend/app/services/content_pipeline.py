from app.services.beat_analyzer import BeatAnalyzer
from app.services.alignment import AlignmentEngine
from app.services.clip_ranker import ClipRanker
from app.services.hook_generator import HookGenerator
from app.services.edit_planner import EditPlanner


class ContentPipeline:
    def __init__(self):
        self.beat_analyzer = BeatAnalyzer()
        self.alignment_engine = AlignmentEngine()
        self.clip_ranker = ClipRanker()
        self.hook_generator = HookGenerator()
        self.edit_planner = EditPlanner()

    def analyze(self, script: str, transcript: dict):
        # 1. Understand the script
        beats = self.beat_analyzer.analyze(script)

        # 2. Match script beats to timestamped footage
        matches = self.alignment_engine.align(
            beats,
            transcript["segments"]
        )

        # 3. Rank the best footage candidates
        clips = self.clip_ranker.rank(matches)

        # 4. Convert ranked clips into frontend-ready AI suggestions
        for index, clip in enumerate(clips, start=1):

            clip["clip_id"] = f"clip_{index:03d}"

            clip["hooks"] = self.hook_generator.generate(
                clip["source_text"],
                clip["beat_type"]
            )

            clip["edit_plan"] = self.edit_planner.create_plan(clip)

        return {
            "beats": beats,
            "matches": matches,
            "clips": clips
        }