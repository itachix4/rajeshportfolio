import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUp,
  Bot,
  ChevronRight,
  Clock3,
  Command,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  answerPortfolioQuestion,
  SUGGESTED_QUESTIONS,
  type AssistantAction,
} from "./assistantKnowledge";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  action?: AssistantAction;
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  text: "I am Parth Intelligence—a portfolio-scoped guide. Ask about his work, stack, process or what he is building. I do not answer outside his verified portfolio knowledge.",
};

const STORAGE_KEY = "parth-portfolio-assistant-v1";

const PortfolioAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [historySearchOpen, setHistorySearchOpen] = useState(false);
  const [historyQuery, setHistoryQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) setMessages(JSON.parse(stored) as Message[]);
    } catch {
      // Storage may be unavailable in privacy modes; the assistant still works in memory.
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Conversation persistence is a progressive enhancement.
    }
  }, [messages]);

  useEffect(() => {
    const openFromPage = () => setOpen(true);
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("parth:assistant-open", openFromPage);
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("parth:assistant-open", openFromPage);
      window.removeEventListener("keydown", handleShortcut);
      if (streamTimer.current !== null) window.clearInterval(streamTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, reduceMotion]);

  const filteredMessages = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter((message) => message.text.toLowerCase().includes(query));
  }, [historyQuery, messages]);

  const submitQuestion = (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || streaming) return;

    const answer = answerPortfolioQuestion(question);
    const userMessage: Message = { id: `user-${Date.now()}`, role: "user", text: question };
    const assistantId = `assistant-${Date.now() + 1}`;
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", text: "", action: answer.action },
    ]);
    setInput("");
    setHistoryQuery("");
    setHistorySearchOpen(false);
    setStreaming(true);

    const tokens = reduceMotion ? [answer.text] : answer.text.match(/\S+\s*/g) ?? [answer.text];
    let tokenIndex = 0;
    if (streamTimer.current !== null) window.clearInterval(streamTimer.current);

    streamTimer.current = window.setInterval(() => {
      const nextToken = tokens[tokenIndex] ?? "";
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId ? { ...message, text: message.text + nextToken } : message,
        ),
      );
      tokenIndex += 1;
      if (tokenIndex >= tokens.length) {
        if (streamTimer.current !== null) window.clearInterval(streamTimer.current);
        streamTimer.current = null;
        setStreaming(false);
      }
    }, reduceMotion ? 0 : 24);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion(input);
  };

  const clearHistory = () => {
    if (streamTimer.current !== null) window.clearInterval(streamTimer.current);
    streamTimer.current = null;
    setStreaming(false);
    setMessages([INITIAL_MESSAGE]);
    setHistoryQuery("");
  };

  return (
    <aside id="assistant" className="parth-assistant" aria-label="Parth portfolio assistant">
      <AnimatePresence>
        {open && (
          <motion.section
            className="parth-assistant__window"
            role="dialog"
            aria-modal="false"
            aria-labelledby="parth-assistant-title"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 22, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="parth-assistant__header">
              <div className="parth-assistant__identity">
                <span className="parth-assistant__orb" aria-hidden="true">
                  <Sparkles size={15} />
                </span>
                <div>
                  <strong id="parth-assistant-title">Parth Intelligence</strong>
                  <span><i /> Portfolio knowledge only</span>
                </div>
              </div>
              <div className="parth-assistant__header-actions">
                <button
                  type="button"
                  onClick={() => setHistorySearchOpen((value) => !value)}
                  aria-label="Search conversation memory"
                  aria-expanded={historySearchOpen}
                >
                  <Search size={17} aria-hidden="true" />
                </button>
                <button type="button" onClick={clearHistory} aria-label="Clear conversation history">
                  <RotateCcw size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close portfolio assistant">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </header>

            <AnimatePresence initial={false}>
              {historySearchOpen && (
                <motion.div
                  className="parth-assistant__search"
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Search size={15} aria-hidden="true" />
                  <label className="sr-only" htmlFor="assistant-history-search">Search conversation memory</label>
                  <input
                    id="assistant-history-search"
                    value={historyQuery}
                    onChange={(event) => setHistoryQuery(event.target.value)}
                    placeholder="Search this conversation"
                  />
                  <span>{filteredMessages.length} found</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={scrollRef} className="parth-assistant__messages" aria-live="polite">
              {filteredMessages.map((message) => (
                <div key={message.id} className={`parth-assistant__message is-${message.role}`}>
                  <span>{message.role === "assistant" ? "PI" : "YOU"}</span>
                  <div>
                    <p>{message.text || <span className="parth-assistant__typing"><i /><i /><i /></span>}</p>
                    {message.action && message.text && (
                      <a href={message.action.href} onClick={() => setOpen(false)}>
                        {message.action.label}
                        <ChevronRight size={15} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {historyQuery && filteredMessages.length === 0 && (
                <div className="parth-assistant__empty">
                  <Clock3 size={17} aria-hidden="true" />
                  Nothing in this conversation matches “{historyQuery}”.
                </div>
              )}
            </div>

            {messages.length <= 2 && !historyQuery && (
              <div className="parth-assistant__suggestions" aria-label="Suggested questions">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((question) => (
                  <button key={question} type="button" onClick={() => submitQuestion(question)}>
                    {question}
                  </button>
                ))}
              </div>
            )}

            <form className="parth-assistant__composer" onSubmit={handleSubmit}>
              <Bot size={17} aria-hidden="true" />
              <label className="sr-only" htmlFor="assistant-question">Ask about Parth</label>
              <input
                ref={inputRef}
                id="assistant-question"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitQuestion(input);
                  }
                }}
                placeholder="Ask about Parth's work..."
                autoComplete="off"
              />
              <button type="submit" disabled={!input.trim() || streaming} aria-label="Send question">
                <ArrowUp size={17} aria-hidden="true" />
              </button>
            </form>

            <footer className="parth-assistant__footer">
              <span>LOCAL KNOWLEDGE ENGINE / NO GENERAL AI</span>
              <span><Command size={11} /> K</span>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`parth-assistant__trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close Parth portfolio assistant" : "Open Parth portfolio assistant"}
        aria-expanded={open}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <span className="parth-assistant__trigger-orb" aria-hidden="true"><Sparkles size={17} /></span>
        <span>
          <strong>Ask Parth AI</strong>
          <small>Portfolio guide</small>
        </span>
        <kbd>⌘ K</kbd>
      </motion.button>
    </aside>
  );
};

export default PortfolioAssistant;
