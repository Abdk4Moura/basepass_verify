import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[80%] max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">BasePass Verify</CardTitle>
          <CardDescription>Welcome to BasePass Verify, your secure visitor verification system.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This system is designed to replace insecure, inefficient, and error-prone manual visitor logging systems.
          </p>
          <div>
            Key Features:
            <ul>
              <li>Secure Code Generation</li>
              <li>Mobile Verification</li>
              <li>Offline Capability</li>
              <li>Audit Trail</li>
              <li>User Management</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
