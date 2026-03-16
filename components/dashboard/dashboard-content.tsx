"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Circle,
  DollarSign,
  FolderKanban,
  Search,
  TrendingUp,
  Users,
  Zap,
  Mail,
  Layout,
  List,
  BarChart
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// -- MailFlux brand: updated intro, quick actions and empty/cta states for campaigns, lists, templates, reporting --
// (other code for table/list CRUD demo remains, but branding reflects MailFlux)

type Metric = {
  label: string;
  value: string;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

type OnboardingStep = {
  title: string;
  description: string;
  href: string;
  done: boolean;
};

type ActivityItem = {
  title: string;
  detail: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
};

type MockProject = {
  id: string;
  name: string;
  owner: string;
  status: string;
};

const metrics: Metric[] = [
  { label: "Campaigns Sent", value: "0", trend: "+0%", icon: Mail, description: "for your startup" },
  { label: "Audience Size", value: "0", trend: "0", icon: Users, description: "Total subscribers" },
  { label: "Open Rate", value: "-", trend: "-", icon: BarChart, description: "Learn after your first send" },
  { label: "Templates Created", value: "0", trend: "+0", icon: Layout, description: "Ready to use" },
];

const onboardingSteps: OnboardingStep[] = [
  { title: "Create your first campaign", description: "Start sending to your audience in minutes.", href: "/dashboard/campaigns", done: false },
  { title: "Import audience list", description: "Upload contacts or add manually.", href: "/dashboard/audience-lists", done: false },
  { title: "Design a template", description: "Build a beautiful email for your campaign.", href: "/dashboard/templates", done: false },
  { title: "Invite your team", description: "Collaborate with your startup team.", href: "/dashboard/team", done: false },
];

const quickActions = [
  { label: "Create Campaign", href: "/dashboard/campaigns", icon: Mail },
  { label: "Manage Audience", href: "/dashboard/audience-lists", icon: List },
  { label: "New Template", href: "/dashboard/templates", icon: Layout },
  { label: "View Reports", href: "/dashboard/reports", icon: BarChart },
];

export function DashboardContent({ greeting, firstName }: { greeting: string; firstName: string }) {
  const [query, setQuery] = useState("");

  // No more project CRUD demo in content for brand launch.
  // (Other dashboard visualizations omitted for brevity - production features to be added in next steps)

  return (
    <>
      {/* Welcome banner */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {greeting}, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome to MailFlux—your startup command center for email marketing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-1.5"
                >
                  <Link href={action.href}>
                    <Icon className="size-3.5" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search MailFlux dashboard..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 bg-muted/50 border-muted-foreground/15 focus-visible:border-border focus-visible:bg-background"
          />
        </div>
      </div>

      {/* Empty state for campaigns (brand aligned) */}
      <Card className="mb-8">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">No campaigns yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start by creating your first campaign or importing an audience into MailFlux.
          </p>
          <div className="flex gap-3 mt-4">
            <Button asChild>
              <Link href="/dashboard/campaigns">Create Campaign</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard/audience-lists">Import Audience</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}