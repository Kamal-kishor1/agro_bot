import { Database, Sprout, CloudRain, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient with image overlay */}
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-95" />
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by data.gov.in</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Indian Agriculture &<br />Climate Data Intelligence
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-12 leading-relaxed max-w-2xl mx-auto">
            Ask questions in natural language. Get instant insights from official datasets.
            Compare states, analyze trends, and make data-backed decisions.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <FeatureCard 
              icon={<Sprout className="w-6 h-6" />}
              title="Crop Production"
              description="State & district-wise production data"
            />
            <FeatureCard 
              icon={<CloudRain className="w-6 h-6" />}
              title="Climate Analysis"
              description="Rainfall patterns & trends"
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Policy Insights"
              description="Data-backed recommendations"
            />
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-strong)] transition-[var(--transition-smooth)]">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
