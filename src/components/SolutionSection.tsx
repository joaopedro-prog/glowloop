
import { CheckCircle } from "lucide-react";

const SolutionSection = () => {
  const features = [
    {
      icon: "💎",
      title: "Loyalty points & rewards system",
      description: "Automatically assign points for visits, services, and referrals. Create reward tiers that clients can redeem.",
    },
    {
      icon: "🔔",
      title: "Automated rebooking reminders",
      description: "Set and forget smart reminders that know when to nudge clients about their next appointment.",
    },
    {
      icon: "✉️",
      title: "Personalized follow-ups",
      description: "Custom templates for follow-up messages that feel personal but require zero effort from you.",
    },
    {
      icon: "📊",
      title: "Track client visits & engagement",
      description: "See who's loyal, who's at risk of churning, and who needs special attention.",
    },
  ];

  return (
    <section id="features" className="section-spacing relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-mint/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-glow-pink/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-lg text-indigo-dark mb-6">
            Meet GlowLoop — your silent client retention machine.
          </h2>
          <p className="text-xl text-gray-600">
            Automate the tedious work of client retention so you can focus on what you do best — providing amazing services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="glow-card p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-indigo-dark mb-2">{feature.title}</h3>
              <p className="text-gray-600 flex-grow">{feature.description}</p>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-mint/10 flex items-center justify-center text-mint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Set up in minutes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="glow-card p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-indigo-dark mb-4">No technical knowledge required</h3>
                <p className="text-gray-600 mb-6">
                  GlowLoop works right out of the box. Import clients, customize your rewards, and watch your retention grow.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-mint mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">Works with any scheduling system</span>
                  </div>
                  <div className="flex items-start">
                    <div className="text-mint mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">Automated SMS & email messaging</span>
                  </div>
                  <div className="flex items-start">
                    <div className="text-mint mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">Client-facing loyalty portal</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-xs bg-gradient-to-r from-glow-pink to-aqua-suave p-1 rounded-xl shadow-lg">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div className="inline-block rounded-full bg-off-white p-3">
                        <div className="text-coral text-3xl">✨</div>
                      </div>
                      <h4 className="text-lg font-bold mt-2">Client Dashboard</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-off-white rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Current Points</span>
                          <span className="font-bold text-coral">350</span>
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <div className="bg-coral h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                        <div className="text-xs text-right mt-1 text-gray-500">70% to next reward</div>
                      </div>
                      <div className="bg-off-white rounded-lg p-3">
                        <div className="text-sm font-medium mb-1">Next Appointment</div>
                        <div className="text-indigo-dark">Feb 15, 2023 • 2:00 PM</div>
                      </div>
                      <div className="bg-mint/10 rounded-lg p-3 text-center">
                        <span className="text-sm font-medium text-mint">Refer a friend: +100 points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
