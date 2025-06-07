import { PageHeader } from "@/components/PageHeader";
import { StatsCard } from "@/components/cards/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockVisitPlans } from "@/lib/mock-data";
import type { VisitPlan } from "@/types";
import { format } from "date-fns";
import { Home, CalendarCheck, CalendarClock, Briefcase, Presentation, Package, Eye } from "lucide-react";
import Link from "next/link";

export default function RepDashboardPage() {
  // Assuming current rep is 'rep1'
  const currentRepId = 'rep1';
  const repVisits = mockVisitPlans.filter(v => v.salesRepRef === currentRepId);

  const today = new Date();
  const scheduledToday = repVisits.filter(v => v.status === 'planned' && new Date(v.scheduledDate).toDateString() === today.toDateString()).length;
  
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  
  const completedThisWeek = repVisits.filter(v => {
    const visitDate = new Date(v.scheduledDate);
    return v.status === 'completed' && visitDate >= firstDayOfWeek && visitDate <= lastDayOfWeek;
  }).length;

  const upcomingVisits = repVisits
    .filter(v => v.status === 'planned' && new Date(v.scheduledDate) >= new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  const quickLinks = [
    { href: "/rep/my-plan", label: "View My Plan", icon: CalendarClock },
    { href: "/rep/clients", label: "View Clients", icon: Briefcase },
    { href: "/rep/materials", label: "Promo Materials", icon: Presentation },
    { href: "/rep/products", label: "Products", icon: Package },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Rep Dashboard" description="Your daily and weekly tasks at a glance." icon={HomeIcon} />

      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard title="Scheduled Visits Today" value={scheduledToday} icon={CalendarClock} />
        <StatsCard title="Completed Visits (This Week)" value={completedThisWeek} icon={CalendarCheck} />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Upcoming Scheduled Visits</CardTitle>
          <CardDescription>Your next few appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingVisits.length > 0 ? (
            <ul className="space-y-3">
              {upcomingVisits.map((visit: VisitPlan) => (
                <li key={visit.visitId} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div>
                    <p className="font-semibold text-foreground">{visit.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(visit.scheduledDate), "EEE, MMM d, yyyy")} at {visit.scheduledTime}
                    </p>
                  </div>
                  <Link href={`/rep/visits/${visit.visitId}`} passHref>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No upcoming visits scheduled.</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Quick Access</CardTitle>
          <CardDescription>Navigate to key sections easily.</CardDescription>
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

    </div>
  );
}

// Placeholder for Home icon if not already imported
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
