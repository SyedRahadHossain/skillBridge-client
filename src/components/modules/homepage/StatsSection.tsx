import { Users, BookOpen, CheckCircle } from "lucide-react";

export default function StatsSection() {

const TutorIcon = () => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <g fill="none" stroke="currentColor" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round">
      <line x1="90" y1="80" x2="440" y2="80"/>
      <line x1="110" y1="80" x2="110" y2="200"/>
      <line x1="420" y1="80" x2="420" y2="300"/>
      <line x1="210" y1="300" x2="440" y2="300"/>
      <line x1="220" y1="148" x2="390" y2="148"/>
      <line x1="195" y1="195" x2="390" y2="195"/>
      <line x1="330" y1="230" x2="205" y2="415"/>
      <circle cx="148" cy="270" r="52"/>
      <path d="M60 435 Q60 355 148 355 Q236 355 236 435" strokeLinecap="round"/>
    </g>
  </svg>
);

  const stats = [
    { label: "Expert Tutors",       value: "500+",    icon: TutorIcon, color: "bg-primary/10 text-primary" },
    { label: "Students Taught",     value: "10,000+", icon: Users,         color: "bg-blue-500/10 text-blue-500" },
    { label: "Subjects Covered",    value: "50+",     icon: BookOpen,      color: "bg-violet-500/10 text-violet-500" },
    { label: "Sessions Completed",  value: "25,000+", icon: CheckCircle,   color: "bg-green-500/10 text-green-500" },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}