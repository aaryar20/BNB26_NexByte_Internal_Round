class CreatorIntelligence:

    def analyze(self, clips):
        if not clips:
            return {
                "overview": {},
                "patterns": [],
                "recommendations": []
            }

        performance_data = self.generate_performance_data(clips)

        overview = self.build_overview(performance_data)

        patterns = self.detect_patterns(performance_data)

        recommendations = self.generate_recommendations(patterns)

        return {
            "overview": overview,
            "patterns": patterns,
            "recommendations": recommendations
        }

    def generate_performance_data(self, clips):
        """
        Generates deterministic demo performance data.

        In production this would come from connected
        platform analytics APIs.
        """

        data = []

        for index, clip in enumerate(clips):

            hook_style = "direct"

            if clip.get("hooks"):
                hook_style = clip["hooks"][0]["style"]

            duration = clip["duration"]

            # Deterministic seeded values for demo purposes.
            views = 12000 + (index * 4200)

            if hook_style == "curiosity":
                views += 5000

            if duration < 30:
                retention = 0.78
            else:
                retention = 0.64

            engagement_rate = 0.062

            if hook_style == "curiosity":
                engagement_rate = 0.089

            if duration < 30:
                engagement_rate += 0.012

            data.append({
                "clip_id": clip["clip_id"],
                "beat_type": clip["beat_type"],
                "duration": duration,
                "hook_style": hook_style,
                "views": views,
                "retention": retention,
                "engagement_rate": engagement_rate
            })

        return data

    def build_overview(self, data):

        total_views = sum(
            item["views"]
            for item in data
        )

        average_engagement = (
            sum(item["engagement_rate"] for item in data)
            / len(data)
        )

        average_retention = (
            sum(item["retention"] for item in data)
            / len(data)
        )

        average_watch_time = (
            sum(
                item["duration"] * item["retention"]
                for item in data
            )
            / len(data)
        )

        return {
            "total_views": total_views,
            "average_engagement_rate": round(
                average_engagement * 100,
                2
            ),
            "average_retention": round(
                average_retention * 100,
                2
            ),
            "average_watch_time": round(
                average_watch_time,
                2
            )
        }

    def detect_patterns(self, data):

        patterns = []

        # -------------------------
        # Hook analysis
        # -------------------------

        curiosity_clips = [
            item for item in data
            if item["hook_style"] == "curiosity"
        ]

        other_clips = [
            item for item in data
            if item["hook_style"] != "curiosity"
        ]

        if curiosity_clips and other_clips:

            curiosity_engagement = (
                sum(
                    item["engagement_rate"]
                    for item in curiosity_clips
                ) / len(curiosity_clips)
            )

            other_engagement = (
                sum(
                    item["engagement_rate"]
                    for item in other_clips
                ) / len(other_clips)
            )

            if curiosity_engagement > other_engagement:

                patterns.append({
                    "type": "hook",
                    "finding": (
                        "Curiosity-based hooks generated "
                        "higher engagement."
                    ),
                    "evidence": (
                        f"Average engagement was "
                        f"{curiosity_engagement * 100:.1f}% "
                        f"compared with "
                        f"{other_engagement * 100:.1f}% "
                        f"for other hooks."
                    )
                })

        # -------------------------
        # Duration analysis
        # -------------------------

        short_clips = [
            item for item in data
            if item["duration"] < 30
        ]

        long_clips = [
            item for item in data
            if item["duration"] >= 30
        ]

        if short_clips and long_clips:

            short_retention = (
                sum(
                    item["retention"]
                    for item in short_clips
                ) / len(short_clips)
            )

            long_retention = (
                sum(
                    item["retention"]
                    for item in long_clips
                ) / len(long_clips)
            )

            if short_retention > long_retention:

                difference = (
                    (short_retention - long_retention)
                    * 100
                )

                patterns.append({
                    "type": "duration",
                    "finding": (
                        "Shorter clips showed stronger "
                        "viewer retention."
                    ),
                    "evidence": (
                        f"Clips under 30 seconds had "
                        f"{difference:.1f} percentage points "
                        f"higher retention."
                    )
                })

        return patterns

    def generate_recommendations(self, patterns):

        recommendations = []

        for pattern in patterns:

            if pattern["type"] == "hook":
                recommendations.append(
                    "Experiment with curiosity-based hooks "
                    "for future short-form content."
                )

            elif pattern["type"] == "duration":
                recommendations.append(
                    "Prioritize shorter clips when the message "
                    "can be delivered without losing context."
                )

        if not recommendations:
            recommendations.append(
                "Continue testing different hooks, topics "
                "and durations to identify stronger patterns."
            )

        return recommendations