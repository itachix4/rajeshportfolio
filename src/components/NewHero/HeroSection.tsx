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

const HEADLINE = "we'd love to\nhear from you!";

const HeroSection = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const reducedMotion = useReducedMotion();

  const typewriter = useTypewriter(HEADLINE, 38, 600, !reducedMotion);
  // Motion-sensitive users get the full headline immediately
  const displayed = reducedMotion ? HEADLINE : typewriter.displayed;
  const done = reducedMotion ? true : typewriter.done;

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

  /* Mobile: scrubbing is disabled, play the video normally */
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
    <>
      <div
        id="top"
        ref={rootRef}
        className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen"
      >
        {/* Background video with native scrubbing */}
        <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            src={VIDEO_SRC}
            className="w-full h-full object-cover object-right lg:object-right-bottom"
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
          <main
            id="spade-hero"
            className="w-full max-w-7xl mx-auto px-6 py-12 pt-28 lg:pt-12 flex-1 flex flex-col justify-center"
          >
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                aria-label="we'd love to hear from you!"
                className="grid text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap"
              >
                {/* Invisible full headline reserves the final two-line
                    height so the page doesn't jump while typing */}
                <span
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1"
                >
                  {HEADLINE}
                </span>
                <span aria-hidden="true" className="col-start-1 row-start-1">
                  {displayed}
                  {!done && (
                    <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
                  )}
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">
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
              <h2 className="text-2xl font-medium tracking-tight mb-2">
                What sort of service?
              </h2>
              <p className="text-[#657464] mb-8">Select all that apply</p>

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
                          ? "bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform"
                          : "bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55"
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
                            <Check
                              size={16}
                              strokeWidth={3}
                              aria-hidden="true"
                            />
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
                    className="italic text-xs text-[#5A635A]"
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
                    <div className="flex items-center justify-between gap-6 bg-[#FAFBF9] border border-[#F1F3F1] rounded-2xl px-6 py-5">
                      <p className="text-sm text-[#1C2E1E]">
                        Ready to inquire about:{" "}
                        <span className="font-medium">
                          {services.join(", ")}
                        </span>
                      </p>
                      <a
                        href={inquiryHref}
                        className="flex items-center gap-1.5 min-h-11 px-3 -mx-3 text-[#4D6D47] uppercase text-xs font-semibold tracking-widest whitespace-nowrap hover:opacity-60 transition-opacity"
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
            className="hidden lg:flex items-center gap-2 absolute bottom-8 left-6 xl:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] text-xs tracking-widest uppercase text-[#657464] select-none"
          >
            <span className="w-px h-10 bg-[#1C2E1E]/25 animate-pulse" />
            Scroll
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
