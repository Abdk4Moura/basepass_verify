"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function AdminDashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>Welcome, Administrator!</p>
          <Button variant="outline">Manage Users <Icons.user className="ml-2 h-4 w-4"/></Button>
          <Button variant="outline">View Logs <Icons.file className="ml-2 h-4 w-4"/></Button>
          <Button variant="outline">Update Settings <Icons.settings className="ml-2 h-4 w-4"/></Button>
        </CardContent>
      </Card>
    </div>
  );
}
