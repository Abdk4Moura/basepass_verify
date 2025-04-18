"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Icons } from "@/components/icons";

type Role = "sponsor" | "checkpoint" | "admin";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("sponsor"); // Default role

  const router = useRouter();

  const handleLogin = () => {
    // Mock authentication logic
    let valid = false;
    switch (role) {
      case "sponsor":
        valid = username === "sponsor" && password === "password";
        break;
      case "checkpoint":
        valid = username === "checkpoint" && password === "password";
        break;
      case "admin":
        valid = username === "admin" && password === "password";
        break;
    }

    if (valid) {
      // Redirect to the appropriate dashboard based on role
      router.push(`/${role}/dashboard`);
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

          {/* Role Toggle Buttons */}
          <div className="flex justify-around">
            <Button variant={role === "sponsor" ? "default" : "outline"} onClick={() => setRole("sponsor")}>
              Sponsor
            </Button>
            <Button variant={role === "checkpoint" ? "default" : "outline"} onClick={() => setRole("checkpoint")}>
              Checkpoint
            </Button>
            <Button variant={role === "admin" ? "default" : "outline"} onClick={() => setRole("admin")}>
              Admin
            </Button>
          </div>

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
