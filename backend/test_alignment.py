from app.services.mock_transcript import get_mock_transcript
from app.services.content_pipeline import ContentPipeline


script = """
Creators waste hours switching between tools.
CreatorAi brings the entire workflow into one platform.
It understands your script and your footage.
It can generate short clips and hooks.
Creators remain in control of every edit.
"""


transcript = get_mock_transcript()

pipeline = ContentPipeline()

result = pipeline.analyze(
    script=script,
    transcript=transcript
)


print("\n")
print("=" * 70)
print("CREATORAI CONTENT ANALYSIS")
print("=" * 70)


print("\nCONTENT BEATS")
print("-" * 70)

for beat in result["beats"]:
    print(
        f"{beat['beat_id']} | "
        f"{beat['beat_type']} | "
        f"{beat['text']}"
    )


print("\n\nFOOTAGE MATCHES")
print("-" * 70)

for match in result["matches"]:

    print(f"\n{match['beat_type']}")
    print(f"Script: {match['beat_text']}")

    for candidate in match["candidates"]:
        print(
            f"  {candidate['start']}s - "
            f"{candidate['end']}s | "
            f"Similarity: {candidate['similarity']} | "
            f"{candidate['text']}"
        )


print("\n\nRANKED CLIPS")
print("-" * 70)

for index, clip in enumerate(
    result["clips"],
    start=1
):

    print(
        f"#{index} | "
        f"{clip['beat_type']} | "
        f"{clip['start']}s - "
        f"{clip['end']}s | "
        f"Score: {clip['score']}"
    )

print("\n")