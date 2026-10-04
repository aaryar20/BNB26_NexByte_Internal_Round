import { useEffect, useRef } from "react";

export default function InteractiveEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame;

    const ripples = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createRipple(x, y, strong = false) {
      ripples.push({
        x,
        y,
        radius: strong ? 4 : 2,
        alpha: strong ? 0.5 : 0.2,
        speed: strong ? 2.8 : 1.3,
        width: strong ? 2 : 1
      });

      if (ripples.length > 45) {
        ripples.shift();
      }
    }

    let lastMove = 0;

    function handleMove(event) {
      const now = performance.now();

      if (now - lastMove < 35) return;

      lastMove = now;

      createRipple(
        event.clientX,
        event.clientY,
        false
      );
    }

    function handleClick(event) {
      createRipple(
        event.clientX,
        event.clientY,
        true
      );
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];

        ripple.radius += ripple.speed;
        ripple.alpha -= 0.008;

        ctx.beginPath();

        ctx.arc(
          ripple.x,
          ripple.y,
          ripple.radius,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle =
          `rgba(90, 33, 50, ${ripple.alpha})`;

        ctx.lineWidth = ripple.width;

        ctx.stroke();

        if (ripple.alpha <= 0) {
          ripples.splice(i, 1);
        }
      }

      animationFrame =
        requestAnimationFrame(animate);
    }

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener(
      "pointermove",
      handleMove
    );
    window.addEventListener(
      "pointerdown",
      handleClick
    );

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        handleMove
      );

      window.removeEventListener(
        "pointerdown",
        handleClick
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-water-canvas"
    />
  );
}