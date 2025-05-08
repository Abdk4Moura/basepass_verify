"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    try {
      await login(username, password);
      // Login successful, wait for useEffect to redirect based on user role
      // console.log('Login initiated...');
      // toast({ title: "Login successful!" }); // Toast shown based on user state change
    } catch (err: any) {
      console.error("Login page error:", err);
      const detail = err?.data?.detail || err.message || "Login failed. Please check your credentials.";
      setError(detail);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: detail,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Redirect based on role once user is fetched after login
  React.useEffect(() => {
    // Don't redirect while loading auth state initially
    if (isLoading) {
      return;
    }
    if (isAuthenticated && user) {
      // console.log("Login page: User authenticated, redirecting based on role:", user.role);
      toast({ title: "Login successful!", description: `Welcome ${user.full_name || user.username}` });
      switch (user.role) {
        case 'sponsor':
          router.push('/sponsor/dashboard');
          break;
        case 'checkpoint_personnel':
          router.push('/checkpoint/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'vehicle_dispatcher':
          router.push('/dispatcher/dashboard'); // Assuming dispatcher route
          break;
        default:
          // Handle unexpected role or redirect to a default page
          router.push('/');
      }
    }
  }, [isAuthenticated, user, router, toast, isLoading]); // Add isLoading dependency


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">BasePass Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoggingIn}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn}
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button type="submit" className="w-full" variant="outline" disabled={isLoggingIn || isLoading}>
              {isLoggingIn ? (
                <> <Icons.loader className="mr-2 h-4 w-4 animate-spin" /> Signing In... </>
              ) : (
                <> Sign In <Icons.shield className="ml-2 h-4 w-4" /> </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}