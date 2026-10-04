import { useEffect } from "react";

export default function ClickSound() {
  useEffect(() => {
    let audioContext = null;

    function playClick(event) {
      const clickable =
        event.target.closest(
          "button, a, [role='button'], input, select"
        );

      if (!clickable) return;

      if (!audioContext) {
        audioContext =
          new (
            window.AudioContext ||
            window.webkitAudioContext
          )();
      }

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        520,
        audioContext.currentTime
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        300,
        audioContext.currentTime + 0.045
      );

      gain.gain.setValueAtTime(
        0.035,
        audioContext.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.055
      );

      oscillator.start();
      oscillator.stop(
        audioContext.currentTime + 0.06
      );
    }

    document.addEventListener(
      "pointerdown",
      playClick
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        playClick
      );

      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return null;
}