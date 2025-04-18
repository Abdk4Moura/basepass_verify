"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SponsorDashboard() {
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorPurpose, setVisitorPurpose] = useState("");

  const handleRegisterVisitor = () => {
    // Implement the logic to register the visitor here
    console.log("Registering visitor:", {
      name: visitorName,
      email: visitorEmail,
      purpose: visitorPurpose,
    });
    alert("Visitor Registered!"); // Placeholder action
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Sponsor Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>Welcome, Sponsor!</p>

          {/* Visitor Registration Section */}
          <section className="grid gap-2">
            <h3 className="text-lg font-semibold">Register New Visitor</h3>
            <Input
              type="text"
              placeholder="Visitor Name"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Visitor Email"
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Purpose of Visit"
              value={visitorPurpose}
              onChange={(e) => setVisitorPurpose(e.target.value)}
            />
            <Button onClick={handleRegisterVisitor} variant="outline">
              Register Visitor <Icons.plusCircle className="ml-2 h-4 w-4" />
            </Button>
          </section>

          {/* View History Section */}
          <section>
            <h3 className="text-lg font-semibold">View Visitor History</h3>
            <Button variant="outline">
              View History <Icons.file className="ml-2 h-4 w-4" />
            </Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
