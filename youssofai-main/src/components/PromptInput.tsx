import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Loader2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const PromptInput = ({ onSubmit, isLoading = false, placeholder = "Message WormGPT..." }: PromptInputProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = value.trim().length > 0 && !isLoading;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <div
        className={`relative rounded-2xl border bg-card transition-all duration-300 ${
          isFocused
            ? "border-foreground/20 shadow-[0_0_0_1px_hsl(var(--foreground)/0.05)]"
            : "border-border hover:border-foreground/10"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          dir="auto"
          className="w-full resize-none bg-transparent px-4 py-3.5 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          style={{ minHeight: "52px", maxHeight: "200px" }}
        />

        <div className="absolute bottom-2.5 right-2.5">
          <AnimatePresence mode="wait">
            <motion.button
              key={isLoading ? "loading" : "submit"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                canSubmit
                  ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
