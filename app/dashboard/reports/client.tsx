"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Client() {
  return (
    <section className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Reporting & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <BarChart3 className="mx-auto mb-4 size-10 text-muted-foreground" />
            <p className="text-lg font-semibold mb-2">No campaign data yet</p>
            <p className="text-muted-foreground mb-4">
              Once you send campaigns, full insights on delivery, opens, and clicks will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}