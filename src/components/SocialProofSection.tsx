
const testimonials = [
  {
    name: "Lisa Johnson",
    role: "Hair Stylist",
    avatar: "L",
    testimonial: "My rebooking rate went from 35% to 72% in just two months with GlowLoop. The automated reminders are a game changer.",
  },
  {
    name: "Mark Rodriguez",
    role: "Nail Salon Owner",
    avatar: "M",
    testimonial: "Our clients love collecting points towards free services. It's increased our average visit frequency by almost 40%.",
  },
  {
    name: "Sarah Williams",
    role: "Esthetician",
    avatar: "S",
    testimonial: "I used to spend hours each week on client follow-ups. GlowLoop does it all for me now, and my clients actually respond!",
  },
];

const SocialProofSection = () => {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-12">
          <h2 className="heading-md text-indigo-dark mb-4">
            Join 37+ beauty pros already using GlowLoop to grow.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-glow-pink to-aqua-suave flex items-center justify-center text-white font-bold">
                  {item.avatar}
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-indigo-dark">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.role}</div>
                </div>
              </div>
              <div className="text-gray-600">"{item.testimonial}"</div>
              <div className="mt-4 text-glow-pink">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
