"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Scan } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const placeholderImage = "https://picsum.photos/128/128";

export default function CheckpointDashboard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, []);

  const handleScan = async () => {
    setScanning(true);
    setVisitorInfo(null); // Clear previous visitor info

    // Simulate scanning for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setScanning(false);

    // Mock visitor information after scanning
    setVisitorInfo({
      name: "John Doe",
      id: "123456789",
      purpose: "Meeting",
      validUntil: "April 30, 2024",
    });
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Checkpoint Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>Welcome, Checkpoint Personnel!</p>
          <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />

          { !(hasCameraPermission) && (
              <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                          Please allow camera access to use this feature.
                        </AlertDescription>
                </Alert>
          )
          }

          <Button variant="outline" disabled={scanning} onClick={handleScan}>
            {scanning ? "Scanning..." : "Scan Code"} <Scan className="ml-2 h-4 w-4"/>
          </Button>

          {visitorInfo && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={placeholderImage} alt="Visitor Image" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>Name: {visitorInfo.name}</p>
                    <p>ID: {visitorInfo.id}</p>
                    <p>Purpose: {visitorInfo.purpose}</p>
                    <p>Valid Until: {visitorInfo.validUntil}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="primary">Grant Access <Icons.check className="ml-2 h-4 w-4" /></Button>
                  <Button variant="destructive">Deny Access <Icons.close className="ml-2 h-4 w-4"/></Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add components for displaying visitor info and granting/denying access */}
        </CardContent>
      </Card>
    </div>
  );
}
