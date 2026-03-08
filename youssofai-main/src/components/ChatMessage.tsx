import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isNew?: boolean;
}

const ChatMessage = ({ role, content, isStreaming, isNew }: ChatMessageProps) => {
  const isUser = role === "user";
  const [liked, setLiked] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState(isNew ? "" : content);
  const [isTyping, setIsTyping] = useState(!!isNew && !!content);
  const hasAnimated = useRef(false);

  // Typewriter effect — word-by-word to preserve markdown tokens
  useEffect(() => {
    if (isUser || !isNew || hasAnimated.current) {
      setDisplayedContent(content);
      return;
    }

    if (content) {
      hasAnimated.current = true;
      setIsTyping(true);
      setDisplayedContent("");

      // Split into words while preserving whitespace/newlines
      const tokens = content.match(/\S+|\s+/g) || [];
      let index = 0;
      let built = "";
      const speed = Math.max(2, Math.min(12, 800 / tokens.length));

      const timer = setInterval(() => {
        if (index < tokens.length) {
          built += tokens[index];
          index++;
          setDisplayedContent(built);
        }
        if (index >= tokens.length) {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(timer);
    }
  }, [content, isUser, isNew]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-3">
          <div className="chat-prose text-sm" dir="auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </motion.div>
    );
  }

  const showActions = !isStreaming && !isTyping && content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full"
    >
      <div className="px-0 py-3">
        {isStreaming && !content ? (
          /* Pulsing circle loader */
          <div className="flex items-center py-1">
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block w-2.5 h-2.5 rounded-full bg-foreground"
            />
          </div>
        ) : (
          <>
            <div className="chat-prose text-foreground" dir="auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");
                    if (match) {
                      return <CodeBlock language={match[1]}>{codeString}</CodeBlock>;
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a({ href, children, ...props }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="chat-link" {...props}>
                        {children}
                      </a>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="chat-table-wrapper">
                        <table className="chat-table">{children}</table>
                      </div>
                    );
                  },
                  input({ checked, ...props }) {
                    return <input type="checkbox" checked={checked} readOnly className="chat-checkbox" {...props} />;
                  },
                }}
              >
                {displayedContent}
              </ReactMarkdown>
            </div>
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0.3] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-2 h-2 rounded-full bg-foreground/50 ml-1 align-middle"
              />
            )}
          </>
        )}
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 mt-2"
          >
            <button
              onClick={() => setLiked(liked === true ? null : true)}
              className={`p-1.5 rounded-md transition-colors ${liked === true ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setLiked(liked === false ? null : false)}
              className={`p-1.5 rounded-md transition-colors ${liked === false ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
