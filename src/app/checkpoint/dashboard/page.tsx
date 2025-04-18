"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function CheckpointDashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Checkpoint Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>Welcome, Checkpoint Personnel!</p>
          <Button>Scan Code <Icons.search className="ml-2 h-4 w-4"/></Button>
          {/* Add components for displaying visitor info and granting/denying access */}
        </CardContent>
      </Card>
    </div>
  );
}
