"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for purpose
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPost } from "@/lib/api"; // Import API helpers
import { Visit, VisitCreate } from "@/schemas"; // Import TS types/interfaces
import { format } from 'date-fns'; // For formatting dates
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";


export default function SponsorDashboard() {
    // Form State
    const [visitorName, setVisitorName] = useState("");
    const [visitorIdType, setVisitorIdType] = useState("");
    const [visitorIdNumber, setVisitorIdNumber] = useState("");
    const [destination, setDestination] = useState("");
    const [purpose, setPurpose] = useState("");
    const [expectedVisitDateTime, setExpectedVisitDateTime] = useState<Date | undefined>(undefined); // Use Date object for Calendar

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [visitHistory, setVisitHistory] = useState<Visit[]>([]);
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const [newlyGeneratedCode, setNewlyGeneratedCode] = useState<string | null>(null);


    const { toast } = useToast();

    // Fetch visit history
    const fetchVisitHistory = async () => {
        setIsFetchingHistory(true);
        setError(null);
        try {
            const data = await apiGet<Visit[]>('/visits/mine');
            setVisitHistory(data);
        } catch (err: any) {
            console.error("Failed to fetch visit history:", err);
            setError(err.message || "Failed to load visit history.");
             toast({ variant: "destructive", title: "Error", description: err.message || "Failed to load visit history." });
        } finally {
            setIsFetchingHistory(false);
        }
    };

    // Fetch history on component mount
    useEffect(() => {
        fetchVisitHistory();
    }, []);

    // Handle Form Submission
    const handleRegisterVisitor = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setNewlyGeneratedCode(null);

        if (!expectedVisitDateTime) {
            setError("Please select an expected visit date and time.");
            setIsLoading(false);
            return;
        }

        const visitData: VisitCreate = {
            visitor_name: visitorName,
            visitor_id_type: visitorIdType || null, // Send null if empty
            visitor_id_number: visitorIdNumber || null, // Send null if empty
            destination: destination,
            purpose: purpose,
            // Format date to ISO string for API (FastAPI handles parsing)
            // Ensure the datetime sent includes timezone offset or is treated as UTC by backend
            expected_visit_datetime: expectedVisitDateTime.toISOString(),
        };

        try {
            const newVisit = await apiPost<Visit>('/visits/', visitData);
            toast({
                title: "Visit Created Successfully!",
                description: `Generated BasePass Code: ${newVisit.basepass_code}`,
            });
            setNewlyGeneratedCode(newVisit.basepass_code ?? 'N/A'); // Show generated code

            // Clear form
            setVisitorName("");
            setVisitorIdType("");
            setVisitorIdNumber("");
            setDestination("");
            setPurpose("");
            setExpectedVisitDateTime(undefined);

            // Refresh history
            fetchVisitHistory(); // Re-fetch the list to include the new visit

        } catch (err: any) {
            console.error("Failed to create visit:", err);
            const errorDetail = err?.data?.detail || err.message || "Failed to create visit.";
            setError(errorDetail);
             toast({ variant: "destructive", title: "Error Creating Visit", description: errorDetail });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sponsor Dashboard</CardTitle>
          <CardDescription>Create and manage visitor access.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Create Visit Section */}
          <form onSubmit={handleRegisterVisitor}>
            <Card>
                <CardHeader>
                     <CardTitle className="text-xl">Register New Visitor</CardTitle>
                 </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="visitorName">Visitor Name <span className="text-destructive">*</span></Label>
                        <Input id="visitorName" placeholder="e.g., John Doe" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} required disabled={isLoading}/>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="visitorIdType">Visitor ID Type</Label>
                        <Input id="visitorIdType" placeholder="e.g., National ID, Passport" value={visitorIdType} onChange={(e) => setVisitorIdType(e.target.value)} disabled={isLoading}/>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="visitorIdNumber">Visitor ID Number</Label>
                        <Input id="visitorIdNumber" placeholder="e.g., 123456789" value={visitorIdNumber} onChange={(e) => setVisitorIdNumber(e.target.value)} disabled={isLoading}/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="destination">Destination <span className="text-destructive">*</span></Label>
                        <Input id="destination" placeholder="e.g., Admin Block, Room 10" value={destination} onChange={(e) => setDestination(e.target.value)} required disabled={isLoading}/>
                    </div>
                     <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="purpose">Purpose of Visit <span className="text-destructive">*</span></Label>
                        <Textarea id="purpose" placeholder="e.g., Official Meeting with HOD" value={purpose} onChange={(e) => setPurpose(e.target.value)} required disabled={isLoading}/>
                    </div>
                     <div className="grid gap-2">
                         <Label htmlFor="expectedVisitDateTime">Expected Date & Time <span className="text-destructive">*</span></Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !expectedVisitDateTime && "text-muted-foreground"
                                    )}
                                    disabled={isLoading}
                                >
                                    <Icons.calendar className="mr-2 h-4 w-4" />
                                    {expectedVisitDateTime ? format(expectedVisitDateTime, "PPP HH:mm") : <span>Pick a date and time</span>}
                                 </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={expectedVisitDateTime}
                                    onSelect={setExpectedVisitDateTime}
                                    initialFocus
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} // Disable past dates
                                />
                                {/* Basic Time Picker - Replace with a proper Time Input component if needed */}
                                <div className="p-3 border-t border-border">
                                     <Label htmlFor="time">Time</Label>
                                     <Input
                                        id="time"
                                        type="time"
                                        defaultValue={expectedVisitDateTime ? format(expectedVisitDateTime, 'HH:mm') : '09:00'}
                                        onChange={(e) => {
                                             const time = e.target.value;
                                             const [hours, minutes] = time.split(':').map(Number);
                                             setExpectedVisitDateTime(currentDate => {
                                                 const newDate = currentDate ? new Date(currentDate) : new Date();
                                                 newDate.setHours(hours, minutes, 0, 0); // Set hours/minutes, reset seconds/ms
                                                 return newDate;
                                             });
                                         }}
                                         disabled={isLoading || !expectedVisitDateTime}
                                     />
                                </div>
                             </PopoverContent>
                         </Popover>
                    </div>
                     <div className="md:col-span-2">
                         <Button type="submit" variant="default" className="w-full md:w-auto" disabled={isLoading}>
                           {isLoading ? <><Icons.loader className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : <>Register & Generate Code <Icons.plusCircle className="ml-2 h-4 w-4" /></>}
                         </Button>
                    </div>

                    {error && (
                         <Alert variant="destructive" className="md:col-span-2">
                            <Icons.alertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                         </Alert>
                    )}
                     {newlyGeneratedCode && (
                         <Alert variant="default" className="md:col-span-2">
                             <Icons.checkCircle className="h-4 w-4" />
                             <AlertTitle>Visit Created!</AlertTitle>
                             <AlertDescription>
                                 BasePass Code: <strong className="font-mono">{newlyGeneratedCode}</strong>
                                 <Button variant="ghost" size="sm" className="ml-2" onClick={() => navigator.clipboard.writeText(newlyGeneratedCode)}>Copy</Button>
                             </AlertDescription>
                         </Alert>
                     )}
                 </CardContent>
            </Card>
          </form>

          {/* View History Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Visitor History</h3>
            <Card>
                 <CardContent className="p-0">
                     {isFetchingHistory ? (
                        <div className="p-6 text-center">Loading history...</div>
                     ) : visitHistory.length === 0 ? (
                         <div className="p-6 text-center text-muted-foreground">No visit history found.</div>
                     ) : (
                        <Table>
                          {/* <TableCaption>A list of your registered visits.</TableCaption> */}
                          <TableHeader>
                            <TableRow>
                              <TableHead>Visitor Name</TableHead>
                              <TableHead>Destination</TableHead>
                              <TableHead>Expected Time</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>BasePass Code</TableHead>
                              <TableHead>Expiry</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {visitHistory.map((visit) => (
                              <TableRow key={visit.id}>
                                <TableCell>{visit.visitor_name}</TableCell>
                                <TableCell>{visit.destination}</TableCell>
                                <TableCell>{format(new Date(visit.expected_visit_datetime), "PPP HH:mm")}</TableCell>
                                <TableCell>{visit.status}</TableCell>
                                <TableCell className="font-mono">{visit.basepass_code || 'N/A'}</TableCell>
                                <TableCell>{visit.code_expiry_datetime ? format(new Date(visit.code_expiry_datetime), "PPP HH:mm") : 'N/A'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                    )}
                 </CardContent>
             </Card>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing Shadcn UI components to src/components/ui if needed:
// - Textarea
// - Popover
// - Calendar
// Add missing Icons if needed:
// - calendar
// - alertCircle
// - checkCircle