from faster_whisper import WhisperModel


class TranscriptionService:

    def __init__(self):
        self.model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    def transcribe(self, file_path: str):

        segments, info = self.model.transcribe(
            file_path,
            beam_size=5
        )

        results = []

        for segment in segments:
            results.append({
                "start": round(segment.start, 2),
                "end": round(segment.end, 2),
                "text": segment.text.strip()
            })

        return {
            "language": info.language,
            "segments": results
        }