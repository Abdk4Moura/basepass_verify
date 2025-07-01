"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  mockGetAllUsers,
  mockGetVehicles,
  mockGetAllVisits,
  mockCreateUser,
  mockCreateVehicle,
  mockUpdateUser,
  mockDeleteUser,
  mockUpdateVehicle,
  mockDeleteVehicle,
  mockGetAllTrips,
  mockGetVisitById,
} from "@/lib/api_mock";
import {
  User,
  Vehicle,
  Visit,
  VehicleTrip,
  UserCreate,
  UserUpdate,
  VehicleCreate,
  VehicleUpdate,
  UserRole,
  VehicleStatus,
  VisitStatus,
} from "@/schemas";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const capitalize = (s: string): string => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
};

export default function AdminDashboard() {
  const { toast } = useToast();

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [trips, setTrips] = useState<VehicleTrip[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog states
  const [userForm, setUserForm] = useState<
    Partial<UserCreate & UserUpdate & { id?: number }>
  >({});
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  const [vehicleForm, setVehicleForm] = useState<
    Partial<VehicleCreate & VehicleUpdate & { id?: number }>
  >({});
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);

  const [selectedVisit, setSelectedVisit] = useState<
    (Visit & { vehicle_trip?: VehicleTrip }) | null
  >(null);
  const [isVisitDetailOpen, setIsVisitDetailOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersData, vehiclesData, visitsData, tripsData] =
        await Promise.all([
          mockGetAllUsers(),
          mockGetVehicles(),
          mockGetAllVisits(),
          mockGetAllTrips(),
        ]);
      setUsers(usersData);
      setVehicles(
        vehiclesData.map((v) => ({
          ...v,
          driver: usersData.find((u) => u.id === v.primary_driver_id),
        }))
      );
      setVisits(visitsData);
      setTrips(tripsData);
      setDrivers(usersData.filter((u) => u.role === "driver"));
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openUserDialog = (user?: User) => {
    setUserForm(
      user ? { ...user } : { role: "sponsor", is_active: true, password: "" }
    );
    setIsUserDialogOpen(true);
  };

  const openVehicleDialog = (vehicle?: Vehicle) => {
    setVehicleForm(vehicle ? { ...vehicle } : { status: "available" });
    setIsVehicleDialogOpen(true);
  };

  const handleViewVisitDetails = async (visitId: number) => {
    try {
      const visitDetails = await mockGetVisitById(visitId);
      if (visitDetails) {
        setSelectedVisit(visitDetails);
        setIsVisitDetailOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Visit details not found.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  const handleUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (userForm.id) {
        await mockUpdateUser(userForm.id, userForm as UserUpdate);
        toast({
          title: "Success",
          description: `User '${userForm.username}' updated.`,
        });
      } else {
        if (!userForm.username || !userForm.password || !userForm.role)
          throw new Error("Username, password, and role are required.");
        await mockCreateUser(userForm as UserCreate);
        toast({
          title: "Success",
          description: `User '${userForm.username}' created.`,
        });
      }
      setIsUserDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVehicleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (vehicleForm.id) {
        await mockUpdateVehicle(vehicleForm.id, vehicleForm as VehicleUpdate);
        toast({
          title: "Success",
          description: `Vehicle '${vehicleForm.plate_number}' updated.`,
        });
      } else {
        if (!vehicleForm.plate_number || !vehicleForm.vehicle_type)
          throw new Error("Plate Number and Type are required.");
        await mockCreateVehicle(vehicleForm as VehicleCreate);
        toast({
          title: "Success",
          description: `Vehicle '${vehicleForm.plate_number}' added.`,
        });
      }
      setIsVehicleDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await mockDeleteUser(userId);
      toast({ title: "Success", description: "User deleted." });
      fetchData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: err.message,
      });
    }
  };

  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
      await mockDeleteVehicle(vehicleId);
      toast({ title: "Success", description: "Vehicle deleted." });
      fetchData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: err.message,
      });
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    const variants: {
      [key in UserRole]: "default" | "secondary" | "destructive" | "outline";
    } = {
      admin: "destructive",
      sponsor: "default",
      checkpoint_personnel: "secondary",
      vehicle_dispatcher: "outline",
      driver: "secondary",
    };
    return variants[role] || "secondary";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Icons.loader className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            System-wide overview and management for BasePass.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Icons.user className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vehicles
            </CardTitle>
            <Icons.car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Visits Logged
            </CardTitle>
            <Icons.file className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visits.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Icons.truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>User Management</CardTitle>
              <Button size="sm" onClick={() => openUserDialog()}>
                <Icons.plusCircle className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.username}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {user.full_name || "No full name"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {capitalize(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openUserDialog(user)}
                        >
                          <Icons.edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={user.role === "admin"}
                            >
                              <Icons.trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the user account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Vehicle Fleet</CardTitle>
              <Button size="sm" onClick={() => openVehicleDialog()}>
                <Icons.plusCircle className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Primary Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-mono">
                        {vehicle.plate_number}
                      </TableCell>
                      <TableCell>
                        {vehicle.driver?.full_name || (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            vehicle.status === "available"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            vehicle.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {capitalize(vehicle.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openVehicleDialog(vehicle)}
                        >
                          <Icons.edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={vehicle.status !== "available"}
                            >
                              <Icons.trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the vehicle. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All System Visits</CardTitle>
          <CardDescription>
            A log of all visit requests in the system. Click a row to see
            details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Sponsor ID</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Expected Time</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow
                    key={visit.id}
                    onClick={() => handleViewVisitDetails(visit.id)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>{visit.visitor_name}</TableCell>
                    <TableCell>{visit.sponsor_id}</TableCell>
                    <TableCell>{visit.destination}</TableCell>
                    <TableCell>
                      {format(new Date(visit.expected_visit_datetime), "PPp")}
                    </TableCell>
                    <TableCell className="font-mono">
                      {visit.basepass_code}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {capitalize(visit.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicle Trips</CardTitle>
          <CardDescription>
            A log of all vehicle facilitation requests and their statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Visit ID</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-bold">{trip.id}</TableCell>
                    <TableCell>{trip.visit_id}</TableCell>
                    <TableCell>{trip.driver?.full_name || "N/A"}</TableCell>
                    <TableCell className="font-mono">
                      {trip.vehicle?.plate_number || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{capitalize(trip.status)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* --- DIALOGS --- */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userForm.id ? "Edit User" : "Create New User"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUserSubmit} className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={userForm.username || ""}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email || ""}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={userForm.full_name || ""}
                onChange={(e) =>
                  setUserForm({ ...userForm, full_name: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
            {!userForm.id && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={userForm.password || ""}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  required={!userForm.id}
                  disabled={isSubmitting}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value: UserRole) =>
                  setUserForm({ ...userForm, role: value })
                }
                value={userForm.role}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {capitalize(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Icons.loader className="animate-spin mr-2" />}
                {userForm.id ? "Save Changes" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {vehicleForm.id ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVehicleSubmit} className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="plate_number">Plate Number</Label>
              <Input
                id="plate_number"
                value={vehicleForm.plate_number || ""}
                onChange={(e) =>
                  setVehicleForm({
                    ...vehicleForm,
                    plate_number: e.target.value?.toUpperCase(),
                  })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle_type">Vehicle Type</Label>
              <Input
                id="vehicle_type"
                value={vehicleForm.vehicle_type || ""}
                onChange={(e) =>
                  setVehicleForm({
                    ...vehicleForm,
                    vehicle_type: e.target.value,
                  })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={vehicleForm.capacity || ""}
                onChange={(e) =>
                  setVehicleForm({
                    ...vehicleForm,
                    capacity: parseInt(e.target.value) || undefined,
                  })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="primary_driver_id">
                Assign Primary Driver (Optional)
              </Label>
              <Select
                onValueChange={(driverId) =>
                  setVehicleForm({
                    ...vehicleForm,
                    primary_driver_id: parseInt(driverId) || undefined,
                  })
                }
                value={String(vehicleForm.primary_driver_id || "null")}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Driver..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={String(driver.id)}>
                      {driver.full_name || driver.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(status: VehicleStatus) =>
                  setVehicleForm({ ...vehicleForm, status: status })
                }
                value={vehicleForm.status}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(VehicleStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {capitalize(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Icons.loader className="animate-spin mr-2" />}
                {vehicleForm.id ? "Save Changes" : "Add Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isVisitDetailOpen} onOpenChange={setIsVisitDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visit Details (ID: {selectedVisit?.id})</DialogTitle>
            <DialogDescription>
              Full overview of the visit and any associated activities.
            </DialogDescription>
          </DialogHeader>
          {selectedVisit && (
            <ScrollArea className="max-h-[70vh] p-4">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Visitor & Sponsor</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong className="text-muted-foreground">
                        Visitor:
                      </strong>{" "}
                      {selectedVisit.visitor_name}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Sponsor:
                      </strong>{" "}
                      {selectedVisit.sponsor?.full_name ||
                        `ID: ${selectedVisit.sponsor_id}`}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Visitor ID:
                      </strong>{" "}
                      {selectedVisit.visitor_id_type || "N/A"} -{" "}
                      {selectedVisit.visitor_id_number || "N/A"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Visit Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong className="text-muted-foreground">
                        Destination:
                      </strong>{" "}
                      {selectedVisit.destination}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Purpose:
                      </strong>{" "}
                      {selectedVisit.purpose}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Expected:
                      </strong>{" "}
                      {format(
                        new Date(selectedVisit.expected_visit_datetime),
                        "PPpp"
                      )}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">Status:</strong>{" "}
                      <Badge>{capitalize(selectedVisit.status)}</Badge>
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        BasePass Code:
                      </strong>{" "}
                      <span className="font-mono">
                        {selectedVisit.basepass_code}
                      </span>
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Expires:
                      </strong>{" "}
                      {format(
                        new Date(selectedVisit.code_expiry_datetime!),
                        "PPpp"
                      )}
                    </p>
                  </CardContent>
                </Card>
                {selectedVisit.vehicle_trip && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Associated Vehicle Trip</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <strong className="text-muted-foreground">
                          Trip ID:
                        </strong>{" "}
                        {selectedVisit.vehicle_trip.id}
                      </p>
                      <p>
                        <strong className="text-muted-foreground">
                          Trip Status:
                        </strong>{" "}
                        <Badge variant="secondary">
                          {capitalize(selectedVisit.vehicle_trip.status)}
                        </Badge>
                      </p>
                      <p>
                        <strong className="text-muted-foreground">
                          Driver:
                        </strong>{" "}
                        {selectedVisit.vehicle_trip.driver?.full_name || "N/A"}
                      </p>
                      <p>
                        <strong className="text-muted-foreground">
                          Vehicle:
                        </strong>{" "}
                        {selectedVisit.vehicle_trip.vehicle?.plate_number ||
                          "N/A"}
                      </p>
                      <p className="col-span-2">
                        <strong className="text-muted-foreground">
                          Driver Notes:
                        </strong>{" "}
                        {selectedVisit.vehicle_trip.driver_notes || "None"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVisitDetailOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
