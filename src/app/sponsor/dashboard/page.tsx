"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const placeholderImage = "https://picsum.photos/128/128";

export default function SponsorDashboard() {
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorPurpose, setVisitorPurpose] = useState("");
  const [visitorHistory, setVisitorHistory] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", purpose: "Meeting", code: "12345" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", purpose: "Interview", code: "67890" },
  ]);

  const handleRegisterVisitor = () => {
    const newVisitor = {
      id: visitorHistory.length + 1,
      name: visitorName,
      email: visitorEmail,
      purpose: visitorPurpose,
      code: Math.random().toString(36).substring(7), // Mock code generation
    };
    setVisitorHistory([...visitorHistory, newVisitor]);
    setVisitorName("");
    setVisitorEmail("");
    setVisitorPurpose("");
    alert("Visitor Registered!"); // Placeholder action
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl">
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
            <h3 className="text-lg font-semibold">Visitor History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitorHistory.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={placeholderImage} alt={visitor.name} />
                          <AvatarFallback>{visitor.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{visitor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{visitor.email}</TableCell>
                    <TableCell>{visitor.purpose}</TableCell>
                    <TableCell>{visitor.code}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
