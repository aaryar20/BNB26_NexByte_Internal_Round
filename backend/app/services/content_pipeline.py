from app.services.beat_analyzer import BeatAnalyzer
from app.services.alignment import AlignmentEngine
from app.services.clip_ranker import ClipRanker
from app.services.hook_generator import HookGenerator
from app.services.edit_planner import EditPlanner
from app.services.platform_adapter import PlatformAdapter
from app.services.creator_intelligence import CreatorIntelligence


class ContentPipeline:
    def __init__(self):
        self.beat_analyzer = BeatAnalyzer()
        self.alignment_engine = AlignmentEngine()
        self.clip_ranker = ClipRanker()
        self.hook_generator = HookGenerator()
        self.edit_planner = EditPlanner()
        self.platform_adapter = PlatformAdapter()
        self.creator_intelligence = CreatorIntelligence()

    def analyze(self, script: str, transcript: dict):

        # 1. Analyze script into content beats
        beats = self.beat_analyzer.analyze(script)

        # 2. Match script beats with transcript segments
        matches = self.alignment_engine.align(
            beats,
            transcript["segments"]
        )

        # 3. Rank the matched clips
        clips = self.clip_ranker.rank(matches)

        # 4. Assign clip IDs BEFORE any service needs them
        for index, clip in enumerate(clips, start=1):
            clip["clip_id"] = f"clip_{index:03d}"

        # 5. Generate hooks, edit plans and platform adaptations
        for clip in clips:

            clip["hooks"] = self.hook_generator.generate(
                clip["source_text"],
                clip["beat_type"]
            )

            clip["edit_plan"] = self.edit_planner.create_plan(
                clip
            )

            clip["platform_adaptations"] = (
                self.platform_adapter.adapt_clip(clip)
            )

        # 6. Generate creator intelligence AFTER clip IDs exist
        creator_intelligence = (
            self.creator_intelligence.analyze(clips)
        )

        return {
            "beats": beats,
            "matches": matches,
            "clips": clips,
            "creator_intelligence": creator_intelligence
        }