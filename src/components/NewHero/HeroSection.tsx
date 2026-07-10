import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import useTypewriter from "./useTypewriter";
import { CONTACT_EMAIL } from "../NewSite/data";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4";

const SERVICE_OPTIONS = ["Brand", "Digital", "Campaign", "Other"];

/* Mouse-driven scrubbing needs a real pointer; wide touch devices
   (e.g. iPad landscape) get normal playback instead */
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

const LINE_ONE = "we'd love to";
const LINE_TWO = "hear from you!";
const HEADLINE = `${LINE_ONE}\n${LINE_TWO}`;

const HeroSection = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const reducedMotion = useReducedMotion();

  const typewriter = useTypewriter(HEADLINE, 38, 600, !reducedMotion);
  // Motion-sensitive users get the full headline immediately
  const displayed = reducedMotion ? HEADLINE : typewriter.displayed;
  const done = reducedMotion ? true : typewriter.done;

  /* Split the typed stream back into its two styled lines */
  const typedLineOne = displayed.slice(0, Math.min(displayed.length, LINE_ONE.length));
  const typedLineTwo =
    displayed.length > LINE_ONE.length + 1
      ? displayed.slice(LINE_ONE.length + 1)
      : "";
  const cursorOnLineTwo = displayed.length > LINE_ONE.length;

  /* Desktop: scrub the video with horizontal mouse movement */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let targetTime = 0;
    let seeking = false;
    let pendingTime: number | null = null;

    const seekTo = (time: number) => {
      seeking = true;
      pendingTime = null;
      video.currentTime = time;
    };

    const onSeeked = () => {
      seeking = false;
      if (pendingTime !== null) seekTo(pendingTime);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;
      if (!video.duration || Number.isNaN(video.duration)) return;
      // Skip expensive seeks once the hero has scrolled out of view
      const root = rootRef.current;
      if (root && root.getBoundingClientRect().bottom < 0) return;
      if (prevX === null) {
        prevX = event.clientX;
        return;
      }
      const delta = event.clientX - prevX;
      prevX = event.clientX;
      targetTime += (delta / window.innerWidth) * 0.8 * video.duration;
      targetTime = Math.min(Math.max(targetTime, 0), video.duration);
      if (seeking) {
        pendingTime = targetTime;
      } else {
        seekTo(targetTime);
      }
    };

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  /* Touch devices: scrubbing is disabled, play the video normally */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) {
      video.autoplay = true;
      video.loop = true;
      video.play().catch(() => {});
    }
  }, []);

  const toggleService = (service: string) => {
    setServices((previous) =>
      previous.includes(service)
        ? previous.filter((item) => item !== service)
        : [...previous, service]
    );
  };

  const inquiryHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Inquiry: ${services.join(", ")}`
  )}`;

  return (
    <div
      id="top"
      ref={rootRef}
      className="relative bg-[#0D120E] text-[#F1EEE3] font-sans antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen"
    >
      {/* Background video, duotone-graded into the theme */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-[#141B15] lg:bg-transparent">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          src={VIDEO_SRC}
          className="video-duotone w-full h-full object-cover object-right lg:object-right-bottom"
        />
        {/* Grade: fade the footage into the canvas */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0D120E] via-transparent to-[#0D120E]/60 lg:bg-gradient-to-r lg:from-[#0D120E] lg:via-[#0D120E]/55 lg:to-transparent"
        />
      </div>

      {/* Moss glow behind the content */}
      <div
        aria-hidden="true"
        className="hero-glow hidden lg:block absolute inset-0 z-[5] pointer-events-none"
      />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-[#0D120E] lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 pt-28 lg:pt-12 flex-1 flex flex-col justify-center"
        >
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[#F1EEE3]/15 bg-[#141B15]/70 px-4 py-2 text-xs font-medium tracking-widest uppercase text-[#B9C2B4]">
              <span className="relative flex w-2 h-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8C69F] opacity-60" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-[#A8C69F]" />
              </span>
              Open to ideas — 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              aria-label="we'd love to hear from you!"
              className="grid font-display text-6xl md:text-7xl lg:text-[96px] leading-[1.02] mb-8 select-none w-full"
            >
              {/* Invisible full headline reserves the final height */}
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1"
              >
                <span className="block">{LINE_ONE}</span>
                <span className="block font-accent">{LINE_TWO}</span>
              </span>
              <span aria-hidden="true" className="col-start-1 row-start-1">
                <span className="block text-[#F1EEE3]">
                  {typedLineOne}
                  {!done && !cursorOnLineTwo && (
                    <span className="inline-block w-[3px] h-[0.9em] bg-[#A8C69F] align-middle ml-[4px] animate-blink" />
                  )}
                </span>
                <span className="block font-accent text-[#A8C69F]">
                  {typedLineTwo}
                  {!done && cursorOnLineTwo && (
                    <span className="inline-block w-[3px] h-[0.9em] bg-[#A8C69F] align-middle ml-[4px] animate-blink" />
                  )}
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl text-[#B9C2B4] leading-relaxed font-normal mb-14 max-w-2xl">
              Whether you have questions, feedback,{" "}
              <br className="hidden md:inline" />
              drop us a message and we&apos;ll get back to you as soon as
              possible.
            </p>
          </motion.div>

          {/* Service pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-medium tracking-tight mb-2 text-[#F1EEE3]">
              What sort of service?
            </h2>
            <p className="text-[#8C978A] mb-8">Select all that apply</p>

            <div className="flex flex-wrap gap-3 mb-8">
              {SERVICE_OPTIONS.map((service) => {
                const isActive = services.includes(service);
                return (
                  <motion.button
                    key={service}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleService(service)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-colors duration-200 select-none cursor-pointer ${
                      isActive
                        ? "bg-[#A8C69F] text-[#0D120E] shadow-lg shadow-[#A8C69F]/20"
                        : "bg-transparent text-[#F1EEE3] border border-[#F1EEE3]/20 hover:bg-[#F1EEE3]/10"
                    }`}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className="flex items-center justify-center"
                        >
                          <Check size={16} strokeWidth={3} aria-hidden="true" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {service}
                  </motion.button>
                );
              })}
            </div>

            {/* Contingent feedback status banner */}
            <AnimatePresence mode="wait">
              {services.length === 0 ? (
                <motion.p
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="italic text-xs text-[#8C978A]"
                >
                  Please click to select services above.
                </motion.p>
              ) : (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="overflow-hidden max-w-2xl"
                >
                  <div className="flex items-center justify-between gap-6 bg-[#141B15]/90 border border-[#F1EEE3]/10 rounded-2xl px-6 py-5 backdrop-blur-sm">
                    <p className="text-sm text-[#F1EEE3]">
                      Ready to inquire about:{" "}
                      <span className="font-medium text-[#A8C69F]">
                        {services.join(", ")}
                      </span>
                    </p>
                    <a
                      href={inquiryHref}
                      className="flex items-center gap-1.5 min-h-11 px-3 -mx-3 text-[#A8C69F] uppercase text-xs font-semibold tracking-widest whitespace-nowrap hover:opacity-60 transition-opacity"
                    >
                      Let&apos;s Go
                      <ArrowRight
                        size={14}
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>

        {/* Scroll cue (desktop only) */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="hidden lg:flex items-center gap-2 absolute bottom-8 left-6 xl:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] text-xs tracking-widest uppercase text-[#8C978A] select-none"
        >
          <span className="w-px h-10 bg-[#A8C69F]/40 animate-pulse" />
          Scroll
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
