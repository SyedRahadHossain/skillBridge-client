import { Search, CalendarCheck, GraduationCap, Star } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Search Tutors",
      description:
        "Browse expert tutors by subject, price, or rating. Filter to find your perfect match.",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: CalendarCheck,
      title: "Book a Session",
      description:
        "Pick a time that works for you and book instantly. No back and forth.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: GraduationCap,
      title: "Start Learning",
      description:
        "Connect with your tutor and start achieving your goals at your own pace.",
      color: "bg-green-500/10 text-green-500",
    },
    {
      icon: Star,
      title: "Leave a Review",
      description:
        "Help others by sharing your experience after each completed session.",
      color: "bg-yellow-500/10 text-yellow-500",
    },
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium text-sm mb-2 uppercase tracking-wide">
            Simple Process
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm">
            Get started in minutes. Find a tutor, book a session, and start
            learning today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-border z-0" />

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              {/* Step number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {index + 1}
              </div>

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-4 mt-2`}
              >
                <step.icon className="h-6 w-6" />
              </div>

              <h3 className="font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
