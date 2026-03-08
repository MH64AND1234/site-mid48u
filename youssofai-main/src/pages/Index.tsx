import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import PromptInput from "@/components/PromptInput";
import ChatMessage from "@/components/ChatMessage";
import { sendMessage, type Message } from "@/lib/deepseek";

interface DisplayMessage extends Message {
  isNew?: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (text: string) => {
    const userMessage: DisplayMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const reply = await sendMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, isNew: true }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again.", isNew: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[100dvh] flex-col bg-background" dir="ltr">
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <motion.h1
            layout
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-6"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            WormGPT
          </motion.h1>
          <motion.div
            layout
            className="w-full"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
          </motion.div>
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="flex flex-col h-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center pt-6 pb-2"
              >
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  WormGPT
                </h1>
              </motion.div>
              <div className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-4">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} isNew={msg.isNew} />
                ))}
                {isLoading && (
                  <ChatMessage role="assistant" content="" isStreaming />
                )}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="p-3 pb-[max(env(safe-area-inset-bottom),16px)]"
          >
            <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Index;
