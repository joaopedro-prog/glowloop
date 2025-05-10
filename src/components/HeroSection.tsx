
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-aqua-suave/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-glow-pink/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block bg-white/80 backdrop-blur-md rounded-full px-4 py-2 border border-gray-100 shadow-sm mb-4">
              <span className="text-sm font-medium bg-gradient-to-r from-glow-pink to-coral text-transparent bg-clip-text">
                🎉 Now in early access
              </span>
            </div>
            
            <h1 className="heading-xl bg-gradient-to-r from-indigo-dark to-indigo-dark/80 text-transparent bg-clip-text">
              Turn One-Time Clients Into Loyal Fans.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              GlowLoop helps beauty professionals automate loyalty, rebookings, and client retention — without spreadsheets or stress.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary">
                Get Early Access
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <a href="#features" className="btn-base border border-gray-200 text-indigo-dark hover:bg-gray-50">
                See how it works
              </a>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-bold">{String.fromCharCode(64 + i)}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">37+ professionals</span> already using GlowLoop
              </p>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            {/* Dashboard mockup */}
            <div className="glow-card relative overflow-hidden rounded-xl shadow-2xl transform lg:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-r from-glow-pink/10 to-aqua-suave/10"></div>
              <div className="bg-indigo-dark p-3 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto text-white/80 text-xs font-medium">GlowLoop Dashboard</div>
              </div>
              <div className="bg-white p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-off-white rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Total Clients</div>
                    <div className="text-2xl font-bold">256</div>
                    <div className="text-xs text-mint flex items-center">
                      <span>↑ 12%</span>
                    </div>
                  </div>
                  <div className="bg-off-white rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Retention Rate</div>
                    <div className="text-2xl font-bold">86%</div>
                    <div className="text-xs text-mint flex items-center">
                      <span>↑ 8%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-off-white rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500">Recent Client</div>
                      <div className="font-medium">Jennifer L.</div>
                    </div>
                    <div className="bg-coral/10 text-coral px-2 py-1 rounded-full text-xs">120 points</div>
                  </div>
                  <div className="bg-off-white rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500">Today's Reminder</div>
                      <div className="font-medium">Follow-up: Sarah K.</div>
                    </div>
                    <div>
                      <div className="bg-mint/10 text-mint px-2 py-1 rounded-full text-xs">3 days since</div>
                    </div>
                  </div>
                  <div className="bg-off-white rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500">Rebooking Status</div>
                      <div className="font-medium">12 automated • 4 pending</div>
                    </div>
                    <div className="bg-aqua-suave/10 text-indigo-dark px-2 py-1 rounded-full text-xs">View all</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-mint rounded-full animate-pulse-glow"></div>
            <div className="absolute -top-5 -left-5 w-12 h-12 bg-coral rounded-full animate-pulse-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
