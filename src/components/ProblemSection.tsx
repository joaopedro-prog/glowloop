
import { CheckCircle } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      title: "No-shows and ghosting?",
      description: "Clients forgetting appointments or disappearing after first visits, hurting your revenue and schedule.",
    },
    {
      title: "Forgetting to follow up?",
      description: "Busy schedules mean missed opportunities to reconnect with clients who could be rebooking.",
    },
    {
      title: "Trying to track loyalty in your head or on paper?",
      description: "Manual tracking is time-consuming and prone to mistakes that frustrate both you and your clients.",
    },
  ];

  return (
    <section id="problem" className="section-spacing bg-indigo-dark text-white overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-t from-transparent to-off-white"></div>
      <div className="absolute -top-10 right-10 w-32 h-32 bg-glow-pink/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-aqua-suave/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto container-padding">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-lg mb-6">Losing clients after one visit?</h2>
          <p className="text-xl text-gray-300">
            You're not alone. Beauty professionals lose up to 50% of new clients without a retention strategy. 
            Let's address the common issues:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="text-coral mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{problem.title}</h3>
              <p className="text-gray-400">{problem.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-xl mx-auto bg-gradient-to-r from-glow-pink to-coral p-0.5 rounded-lg">
          <div className="bg-indigo-dark rounded-lg p-6 text-center">
            <p className="text-lg md:text-xl font-medium">
              What if you could solve all these problems with one simple solution?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
