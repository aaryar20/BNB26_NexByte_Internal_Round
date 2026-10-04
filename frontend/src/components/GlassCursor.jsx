import { useEffect, useRef } from "react";

export default function GlassCursor() {
  const glassRef = useRef(null);

  useEffect(() => {
    const moveGlass = (e) => {
      if (!glassRef.current) return;

      glassRef.current.style.transform =
        `translate3d(${e.clientX - 140}px, ${e.clientY - 140}px, 0)`;
    };

    window.addEventListener("mousemove", moveGlass);

    return () => {
      window.removeEventListener("mousemove", moveGlass);
    };
  }, []);

  return <div ref={glassRef} className="cursor-glass" />;
}