"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Icons } from "@/components/icons";
import { SponsorProfile, CheckpointProfile, AdminProfile } from "@/lib/mock-profiles"; // Import mock profiles

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    // Mock authentication logic: test@example.com/password
    if (username === "test@example.com" && password === "password") {
      // Determine the role based on some mock logic (can be extended later)
      let profile;
      if (username.startsWith("sponsor")) {
        profile = SponsorProfile;
      } else if (username.startsWith("checkpoint")) {
        profile = CheckpointProfile;
      } else {
        profile = AdminProfile;
      }

      // Redirect to the appropriate dashboard based on profile/role
      if (profile === SponsorProfile) {
        router.push(`/sponsor/dashboard`);
      } else if (profile === CheckpointProfile) {
        router.push(`/checkpoint/dashboard`);
      } else {
        router.push(`/admin/dashboard`);
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Username and Password Input */}
          <div className="grid gap-2">
            <label htmlFor="username">Username</label>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Sign In Button */}
          <Button onClick={handleLogin}>
            Sign In <Icons.shield className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
