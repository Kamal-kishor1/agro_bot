import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Trash2, Copy, Check } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    let assistantContent = "";
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ message: input.trim() }),
        }
      );
      
      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
          return;
        }
        if (response.status === 402) {
          toast.error("AI service requires payment. Please contact administrator.");
          return;
        }
        throw new Error(`Failed to get response: ${response.status}`);
      }
      
      if (!response.body) throw new Error("No response body");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      
      // Create assistant message placeholder
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            // Ignore parsing errors for incomplete JSON
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      // Remove the empty assistant message if error occurred
      setMessages(prev => prev.filter(m => m.content !== ""));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleClearChat = () => {
    setMessages([]);
    toast.success("Chat history cleared");
  };
  
  const handleCopyMessage = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success("Response copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  // Example questions
  const exampleQuestions = [
    "Compare average rainfall across top 5 states for the last 3 years",
    "Which districts have highest wheat production in Punjab?",
    "Correlate rice production with monsoon rainfall in West Bengal",
    "Analyze crop failure patterns in drought-prone districts",
    "What crops are best suited for low rainfall regions?",
    "Compare state-wise agricultural productivity trends",
  ];
  
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ask Your Question
            </h2>
            <p className="text-muted-foreground">
              Natural language queries about Indian agriculture and climate data
            </p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="flex-shrink-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          )}
        </div>
        
        {/* Chat messages */}
        <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-medium)] mb-6 overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-8">
              <p className="text-center text-muted-foreground mb-6">
                Try asking one of these questions:
              </p>
              <div className="space-y-3">
                {exampleQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="w-full text-left p-4 rounded-lg bg-accent/50 hover:bg-accent text-accent-foreground transition-[var(--transition-smooth)] text-sm border border-border"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className="relative group">
                  <ChatMessage role={msg.role} content={msg.content} />
                  {msg.role === "assistant" && msg.content && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyMessage(msg.content, idx)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-medium)] p-4">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crop production, rainfall patterns, state comparisons..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </section>
  );
};
