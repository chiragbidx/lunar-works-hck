"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Client() {
  return (
    <section className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Templates</span>
            <Button>
              <PlusCircle className="mr-2" /> New Template
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <p className="text-lg font-semibold mb-2">No templates yet</p>
            <p className="text-muted-foreground mb-4">
              Quickly create beautiful templates for use in your campaigns.
            </p>
            <Button>
              <PlusCircle className="mr-2" /> Create Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}