import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";
  
  return (
    <div
      className={cn(
        "flex gap-4 items-start",
        isUser && "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div
        className={cn(
          "flex-1 rounded-xl p-4 max-w-[85%]",
          isUser 
            ? "bg-primary/10 text-foreground border border-primary/20" 
            : "bg-muted text-foreground"
        )}
      >
        <div className="prose prose-sm max-w-none">
          {content.split('\n').map((line, idx) => (
            <p key={idx} className="mb-2 last:mb-0 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
