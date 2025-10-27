import { HeroSection } from "@/components/HeroSection";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ChatInterface />
      
      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Data sources: Ministry of Agriculture & Farmers Welfare, India Meteorological Department (IMD)
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by data.gov.in | Demo prototype for policy insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
