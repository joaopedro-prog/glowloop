
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const LeadCaptureSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you soon!",
        variant: "default",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-mint/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-glow-pink/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto container-padding">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-glow-pink to-aqua-suave p-0.5 rounded-xl shadow-xl">
            <div className="bg-white rounded-lg p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="heading-md text-indigo-dark mb-4">
                  Ready to stop losing clients?
                </h2>
                <p className="text-lg text-gray-600">
                  Join our waitlist for early access and secure a founding member discount.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow border-gray-200 focus:border-coral focus:ring-coral"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  className="btn-primary whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Join the waitlist and get 1 free month"}
                </Button>
              </form>
              
              <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <svg 
                    className="w-5 h-5 text-mint mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                    />
                  </svg>
                  <span>We'll never share your email</span>
                </div>
                <div className="flex items-center">
                  <svg 
                    className="w-5 h-5 text-mint mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" 
                    />
                  </svg>
                  <span>Cancel anytime, no questions asked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureSection;
