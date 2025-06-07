import { PageHeader } from "@/components/PageHeader";
import { StatsCard } from "@/components/cards/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSalesReps, mockVisitPlans } from "@/lib/mock-data";
import { Users, CalendarCheck, CalendarClock, Briefcase, Presentation, Package, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ManagerDashboardPage() {
  const totalReps = mockSalesReps.length;
  const totalPlannedVisits = mockVisitPlans.filter(v => v.status === 'planned').length;
  const completedVisitsThisWeek = mockVisitPlans.filter(v => {
    const visitDate = new Date(v.scheduledDate);
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    return v.status === 'completed' && visitDate >= firstDayOfWeek && visitDate <= lastDayOfWeek;
  }).length;

  const quickLinks = [
    { href: "/manager/reps", label: "Manage Representatives", icon: Users },
    { href: "/manager/clients", label: "Manage Clients", icon: Briefcase },
    { href: "/manager/materials", label: "Manage Promo Materials", icon: Presentation },
    { href: "/manager/products", label: "Manage Products", icon: Package },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Manager Dashboard" description="Overview of team performance and activities." icon={Home} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Representatives" value={totalReps} icon={Users} />
        <StatsCard title="Total Planned Visits" value={totalPlannedVisits} icon={CalendarClock} />
        <StatsCard title="Completed Visits (This Week)" value={completedVisitsThisWeek} icon={CalendarCheck} />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Quick Actions</CardTitle>
          <CardDescription>Access key management areas quickly.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map(link => (
            <Link href={link.href} key={link.href} passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <link.icon className="mr-3 h-5 w-5 text-primary" />
                <span className="text-base">{link.label}</span>
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Representative Performance</CardTitle>
            <CardDescription>Summary of sales representatives' activities.</CardDescription>
          </div>
          <Link href="/manager/reps" passHref>
            <Button variant="outline" size="sm">View All Reps</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {mockSalesReps.slice(0, 3).map(rep => (
            <div key={rep.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div>
                <p className="font-semibold text-foreground">{rep.user?.displayName}</p>
                <p className="text-sm text-muted-foreground">{rep.territory}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Completed: {rep.totalVisitsMade}</p>
                <p className="text-sm text-muted-foreground">Planned: {rep.totalVisitsPlanned}</p>
              </div>
            </div>
          ))}
          {mockSalesReps.length === 0 && <p className="text-muted-foreground">No sales representatives found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder for Home icon if not already imported
const Home = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
