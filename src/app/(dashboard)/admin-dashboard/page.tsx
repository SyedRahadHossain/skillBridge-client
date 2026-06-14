import { adminService } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Star, UserCheck, CheckCircle } from "lucide-react";

export default async function AdminDashboardPage() {
  const { data: stats } = await adminService.getStats();

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Tutors",
      value: stats?.totalTutors ?? "—",
      icon: UserCheck,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Total Students",
      value: stats?.totalStudents ?? "—",
      icon: Users,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? "—",
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Completed",
      value: stats?.completedBookings ?? "—",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Reviews",
      value: stats?.totalReviews ?? "—",
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <span className="text-sm text-muted-foreground font-bold">
                  {card.label}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
