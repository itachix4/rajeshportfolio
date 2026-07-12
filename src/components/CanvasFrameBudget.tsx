import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

const CanvasFrameBudget = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const { gl, invalidate, setFrameloop } = useThree();

  useEffect(() => {
    if (reducedMotion) {
      setFrameloop("demand");
      invalidate();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFrameloop(entry.isIntersecting ? "always" : "demand");
        if (entry.isIntersecting) invalidate();
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );

    observer.observe(gl.domElement);
    return () => observer.disconnect();
  }, [gl, invalidate, reducedMotion, setFrameloop]);

  return null;
};

export default CanvasFrameBudget;
