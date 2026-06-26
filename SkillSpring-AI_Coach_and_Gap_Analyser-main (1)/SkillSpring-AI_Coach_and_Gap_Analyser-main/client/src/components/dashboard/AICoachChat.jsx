import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, SendHorizonal, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Stagger variants for the hints panel
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

function TypewriterText({ text }) {
  const words = text.split(' ');
  
  return (
    <motion.div 
      initial="hidden" 
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.015 }
        }
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, filter: 'blur(4px)' },
            visible: { opacity: 1, filter: 'blur(0px)' }
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function AICoachChat({
  messages,
  onSend,
  isChatting,
  suggestedQuestions,
  targetRole,
}) {
  const [draft, setDraft] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const submit = (event) => {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    onSend(draft);
    setDraft('');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.68fr_0.32fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="flex h-[600px] xl:h-[720px] flex-col overflow-hidden p-0">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-teal">AI Coach</p>
            <h3 className="mt-3 font-display text-3xl text-brand-text">Context-aware career guidance</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Ask strategy questions and get answers grounded in your skill map, current gaps, and{' '}
              {targetRole} target.
            </p>
          </div>

          <div ref={containerRef} className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[84%] rounded-[28px] px-6 py-5 ${
                      message.role === 'assistant'
                        ? 'border border-white/10 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.15)] text-slate-800'
                        : 'bg-gradient-to-br from-brand-teal via-brand-indigo to-brand-violet !text-white shadow-[0_18px_36px_rgba(37,99,235,0.25)]'
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.24em]">
                      {message.role === 'assistant' ? (
                        <Bot className="h-4 w-4 text-brand-teal" />
                      ) : (
                        <User className="h-4 w-4 text-white/80" />
                      )}
                      <span>{message.role === 'assistant' ? 'AI Coach' : 'You'}</span>
                    </div>
                    <div className="chat-markdown text-[15px] leading-relaxed">
                      {message.streaming && !message.content ? (
                        <div className="flex items-center gap-2 text-brand-teal/60 font-medium italic">
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Synthesizing roadmap context...
                          </motion.span>
                        </div>
                      ) : message.role === 'assistant' ? (
                        message.streaming ? (
                          <TypewriterText text={message.content} />
                        ) : (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        )
                      ) : (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={submit} className="border-t border-white/10 px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                {suggestedQuestions.map((question) => (
                  <motion.button
                    key={question}
                    type="button"
                    onClick={() => onSend(question)}
                    disabled={isChatting}
                    whileHover={!isChatting ? { scale: 1.03 } : {}}
                    whileTap={!isChatting ? { scale: 0.97 } : {}}
                    className={`rounded-full border px-4 py-2 text-sm shadow-sm transition ${
                      isChatting 
                        ? 'border-brand-teal/10 bg-brand-teal/5 text-brand-teal/50 cursor-not-allowed' 
                        : 'border-brand-teal/20 bg-brand-teal/5 text-brand-teal hover:border-brand-teal/40 hover:bg-brand-teal/10 hover:text-teal-400'
                    }`}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={2}
                  placeholder="Ask for the next best skill, a practice drill, or a personalized quiz..."
                  className="min-h-[80px] flex-1 resize-none rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-brand-teal/40 focus:bg-white/10 focus:ring-4 focus:ring-brand-teal/10"
                />
                <Button type="submit" className="sm:w-auto h-[80px]" disabled={isChatting}>
                  <SendHorizonal className="h-5 w-5" />
                  <span className="hidden sm:inline">{isChatting ? 'Streaming...' : 'Send'}</span>
                  <span className="sm:hidden">{isChatting ? 'Sending' : 'Send question'}</span>
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-6 h-fit">
          <p className="text-sm uppercase tracking-[0.28em] text-brand-muted">Coach Hints</p>
          <div className="mt-5 space-y-4">
            <motion.div variants={staggerItem} className="rounded-[24px] border border-brand-teal/20 bg-brand-teal/10 p-5 text-sm leading-7 text-brand-teal">
              Ask for ordering, not just resources. The best questions start with “what should I do
              first?” or “how should I prove this skill?”
            </motion.div>
            <motion.div variants={staggerItem} className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
              The coach already knows your target role and live gap matrix, so you do not need to
              restate context every time.
            </motion.div>
            <motion.div variants={staggerItem} className="rounded-[24px] border border-brand-violet/20 bg-brand-violet/10 p-5 text-sm leading-7 text-violet-300">
              Try a practice prompt like “Quiz me on React and accessibility, then rate my answers.”
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
