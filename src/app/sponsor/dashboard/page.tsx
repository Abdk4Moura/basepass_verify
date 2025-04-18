"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function SponsorDashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Sponsor Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>Welcome, Sponsor!</p>
          <Button variant="outline">Register Visitor <Icons.plusCircle className="ml-2 h-4 w-4"/></Button>
          <Button variant="outline">View History <Icons.file className="ml-2 h-4 w-4"/></Button>
          {/* Add components for registering visitors and generating codes */}
        </CardContent>
      </Card>
    </div>
  );
}
/
