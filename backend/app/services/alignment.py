from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


class AlignmentEngine:

    def __init__(self):

        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    def align(
        self,
        beats,
        transcript_segments
    ):

        beat_texts = [
            beat["text"]
            for beat in beats
        ]

        segment_texts = [
            segment["text"]
            for segment in transcript_segments
        ]

        beat_embeddings = self.model.encode(
            beat_texts
        )

        segment_embeddings = self.model.encode(
            segment_texts
        )

        similarity_matrix = cosine_similarity(
            beat_embeddings,
            segment_embeddings
        )

        matches = []

        for beat_index, beat in enumerate(beats):

            scores = similarity_matrix[
                beat_index
            ]

            ranked_indices = scores.argsort()[::-1]

            candidates = []

            for segment_index in ranked_indices[:3]:

                segment = transcript_segments[
                    segment_index
                ]

                candidates.append({
                    "start": segment["start"],
                    "end": segment["end"],
                    "text": segment["text"],
                    "similarity": round(
                        float(scores[segment_index]),
                        4
                    )
                })

            matches.append({
                "beat_id": beat["beat_id"],
                "beat_type": beat["beat_type"],
                "beat_text": beat["text"],
                "candidates": candidates
            })

        return matches