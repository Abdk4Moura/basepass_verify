// frontend_mini/src/app/login/page.tsx (Updated with pre-login check)
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, logout, user, isLoading, isAuthenticated } = useAuth(); // Get logout function
  const router = useRouter();
  const { toast } = useToast();

  // Redirect logic is removed from here as the protected layouts will handle it
  // This page now only handles the login process itself or shows the logout prompt

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    try {
        // If another user is already authenticated, log them out first.
        if (isAuthenticated) {
            await logout(false); // Pass false to prevent immediate redirect
        }
        await login(username, password);
        // After successful login, the protected layout of the target dashboard will handle rendering.
        // Or AuthContext could trigger a redirect. For simplicity, we rely on the user navigating.
        // A direct redirect can be added here if needed.
    } catch (err: any) {
        const detail = err?.data?.detail || err.message || "Login failed. Please check your credentials.";
        setError(detail);
    } finally {
        setIsLoggingIn(false);
    }
  };
  
  // Need to update AuthContext to accept a redirect flag
  // Let's adjust the login page logic to be simpler for now.

  if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen"><Icons.loader className="animate-spin h-10 w-10"/></div>
  }

  // If a user is already logged in, show the logout prompt instead of the login form
  if (isAuthenticated && user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 font-serif">
            <Card className="w-full max-w-md mx-4 text-center">
                <CardHeader>
                    <CardTitle>Already Logged In</CardTitle>
                    <CardDescription>You are currently logged in as <strong className="font-bold">{user.username}</strong>.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button className="w-full" onClick={() => {
                        const dashboardPath = { sponsor: '/sponsor/dashboard', checkpoint_personnel: '/checkpoint/dashboard', vehicle_dispatcher: '/dispatcher/dashboard', admin: '/admin/dashboard' }[user.role] || '/';
                        router.push(dashboardPath);
                    }}>
                        Go to Dashboard
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => logout()}>
                        Sign Out & Login as Different User
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  // If no user is logged in, show the standard login form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 font-serif">
      <Card className="w-full max-w-md mx-4 shadow-xl rounded-lg bg-white dark:bg-gray-900">
        <CardHeader className="text-center space-y-2 pt-8">
          <CardTitle className="text-3xl font-bold">BasePass Login</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-6 py-4">
            {error && (
              <Alert variant="destructive">
                <Icons.alertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="e.g., admin" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoggingIn} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoggingIn} />
            </div>
            <Button type="submit" className="w-full h-11" variant="default" disabled={isLoggingIn || isLoading}>
              {isLoggingIn ? <><Icons.loader className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : <>Sign In <Icons.shield className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// **AND update AuthContext.logout to accept an optional redirect flag:**
// In frontend_mini/src/context/AuthContext.tsx
// const logout = (redirect = true) => {
//     removeToken();
//     setToken(null);
//     setUser(null);
//     if (redirect && typeof window !== 'undefined') {
//          window.location.href = '/login';
//     }
// };