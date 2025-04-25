"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [logs, setLogs] = useState([
    { id: 1, timestamp: "2024-05-15 10:00", action: "User login", user: "admin" },
    { id: 2, timestamp: "2024-05-15 10:05", action: "User created", user: "admin" },
  ]);
  const [settings, setSettings] = useState({
    allowOffline: true,
    maxCodeAge: 3600,
  });

  const handleSearchUser = () => {
    console.log("Searching for user:", userSearchTerm);
  };

  const filteredLogs = logs.filter(log => log.action.toLowerCase().includes(userSearchTerm.toLowerCase()) || log.user.toLowerCase().includes(userSearchTerm.toLowerCase()));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>Welcome, Administrator!</p>

          {/* Manage Users Section */}
          <section className="grid gap-2">
            <h3 className="text-lg font-semibold">Manage Users</h3>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search User"
                className="flex-grow"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
              <Button onClick={handleSearchUser}>Search</Button>
            </div>
            {/* User list or management UI would go here */}
            <p>User management interface goes here (e.g., add, delete, modify roles).</p>
            <Button variant="outline">Add User <Icons.userPlus className="ml-2 h-4 w-4" /></Button>
          </section>

          {/* View Logs Section */}
          <section className="grid gap-2">
            <h3 className="text-lg font-semibold">View Logs</h3>
              <ul>
                {filteredLogs.map((log) => (
                  <li key={log.id}>
                    {log.timestamp} - {log.action} by {log.user}
                  </li>
                ))}
              </ul>
            <Button variant="outline">Download Logs <Icons.download className="ml-2 h-4 w-4" /></Button>
          </section>

          {/* Update Settings Section */}
          <section className="grid gap-2">
            <h3 className="text-lg font-semibold">Update Settings</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.allowOffline}
                onChange={(e) => setSettings({ ...settings, allowOffline: e.target.checked })}
              />
              <span>Allow Offline Access</span>
            </label>
            <label>
              Max Code Age (seconds):
              <Input
                type="number"
                value={settings.maxCodeAge}
                onChange={(e) => setSettings({ ...settings, maxCodeAge: parseInt(e.target.value) })}
              />
            </label>
            <Button variant="outline">Save Settings <Icons.save className="ml-2 h-4 w-4" /></Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
