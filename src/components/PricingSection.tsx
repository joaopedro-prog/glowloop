
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PricingSection = () => {
  return (
    <section id="pricing" className="section-spacing bg-indigo-dark text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-t from-transparent to-off-white"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-glow-pink/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-aqua-suave/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-lg mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-300">
            Launching soon — starting at just $12/month.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <div className="inline-block bg-gradient-to-r from-glow-pink to-coral text-white px-3 py-1 rounded-full text-xs font-medium mb-2">
                    EARLY ACCESS OFFER
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Founding Member Plan</h3>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-3xl font-bold text-white">$12<span className="text-gray-300 text-lg">/month</span></div>
                  <div className="text-sm text-gray-400">Billed annually or $15 monthly</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-aqua-suave mb-4">Everything you need</h4>
                  <ul className="space-y-3">
                    {[
                      "Unlimited client profiles",
                      "Customizable loyalty program",
                      "Automated rebooking reminders",
                      "Client-facing rewards portal",
                      "Detailed analytics dashboard"
                    ].map((feature, index) => (
                      <li key={index} className="flex">
                        <div className="text-mint mr-2 mt-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-aqua-suave mb-4">Founding member perks</h4>
                  <ul className="space-y-3">
                    {[
                      "Early access to new features",
                      "Priority support",
                      "Lifetime discount",
                      "Free onboarding call",
                      "No price increases — ever"
                    ].map((feature, index) => (
                      <li key={index} className="flex">
                        <div className="text-mint mr-2 mt-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 text-center text-sm text-gray-300 mb-8">
                Limited to first 100 beauty professionals • No credit card required to join waitlist
              </div>
              
              <div className="flex flex-col items-center">
                <Button className="btn-secondary w-full max-w-md mb-4 bg-gradient-to-r from-mint to-aqua-suave text-indigo-dark">
                  Join the waitlist and get 1 free month
                </Button>
                <div className="text-xs text-gray-400">
                  By joining, you agree to our Terms of Service and Privacy Policy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
