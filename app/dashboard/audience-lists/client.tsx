"use client";

import { Upload, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Client() {
  return (
    <section className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Audience Lists</span>
            <Button>
              <PlusCircle className="mr-2" /> Add Audience
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <p className="text-lg font-semibold mb-2">No audience lists yet</p>
            <p className="text-muted-foreground mb-4">
              Import a CSV or add contacts to start growing your reach.
            </p>
            <div className="flex gap-4 justify-center">
              <Button>
                <Upload className="mr-2" /> Import CSV
              </Button>
              <Button variant="secondary">
                <PlusCircle className="mr-2" /> Add Audience
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}