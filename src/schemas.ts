export type UserRole = "sponsor" | "checkpoint_personnel" | "vehicle_dispatcher" | "admin" | "driver";
export type VisitStatus = "pending_verification" | "verified_at_checkpoint" | "vehicle_requested" | "vehicle_assigned" | "en_route_with_vehicle" | "destination_reached" | "expired" | "cancelled";
export type VehicleStatus = "available" | "assigned" | "en_route" | "maintenance" | "unavailable";
export type VehicleTripStatus = "pending_assignment" | "assigned" | "en_route" | "completed" | "cancelled";


// Base interfaces matching Pydantic BaseModels (excluding methods like model_dump)
interface UserBase {
    username: string;
    email?: string | null;
    full_name?: string | null;
    role: UserRole;
    is_active?: boolean | null;
}

export interface UserCreate extends UserBase {
    password: string;
}

export interface UserUpdate {
    email?: string | null;
    full_name?: string | null;
    password?: string | null;
    is_active?: boolean | null;
    role?: UserRole | null;
}

export interface User extends UserBase { // For responses
    id: number;
    created_at: string; // Dates will likely be strings in JSON
    updated_at: string;
}

// --- Token Schemas ---
export interface Token {
    access_token: string;
    token_type: string;
}

export interface TokenData {
    username?: string | null;
}

// --- Visit Schemas ---
interface VisitBase {
    visitor_name: string;
    visitor_id_type?: string | null;
    visitor_id_number?: string | null;
    destination: string;
    purpose: string;
    expected_visit_datetime: string; // Use string for datetime in/out of API
}

export interface VisitCreate extends VisitBase { }

export interface VisitUpdate {
    visitor_name?: string | null;
    visitor_id_type?: string | null;
    visitor_id_number?: string | null;
    destination?: string | null;
    purpose?: string | null;
    expected_visit_datetime?: string | null;
    // status?: VisitStatus | null; // Status handled separately
}

export interface VisitStatusUpdate {
    status: VisitStatus;
}

export interface Visit extends VisitBase {
    id: number;
    sponsor_id: number;
    basepass_code?: string | null;
    code_generated_at?: string | null;
    code_expiry_datetime?: string | null;
    status: VisitStatus;
    created_at: string;
    updated_at: string;
    // sponsor?: User | null; // Optional nested sponsor
}

// --- Vehicle Schemas ---
interface VehicleBase {
    vehicle_type: string;
    plate_number: string;
    capacity?: number | null;
    status?: VehicleStatus | null;
}

export interface VehicleCreate extends VehicleBase { }

export interface VehicleUpdate {
    vehicle_type?: string | null;
    plate_number?: string | null;
    capacity?: number | null;
    status?: VehicleStatus | null;
}

export interface Vehicle extends VehicleBase {
    id: number;
    added_at: string;
    updated_at: string;
}


// --- CheckpointLog Schemas ---
interface CheckpointLogBase {
    checkpoint_name: string;
    action_taken?: string | null;
}

export interface CheckpointLogCreate extends CheckpointLogBase {
    // visit_id is implicit or passed separately to CRUD
}

export interface CheckpointLog extends CheckpointLogBase {
    id: number;
    visit_id: number;
    verification_time: string; // Renamed from created_at in models? Ensure consistency
    created_at: string;
}

// --- Verification Schemas ---
export interface VerificationRequest {
    basepass_code: string;
    checkpoint_name: string;
}

// --- VehicleTrip Schemas ---
interface VehicleTripBase {
    status?: VehicleTripStatus | null;
}

export interface VehicleTripCreate extends VehicleTripBase {
    visit_id: number;
    vehicle_id?: number | null;
}

export interface AssignVehicleRequest {
    vehicle_id: number;
}

export interface UpdateTripStatusRequest {
    status: VehicleTripStatus;
}

export interface VehicleTrip extends VehicleTripBase {
    id: number;
    visit_id: number;
    vehicle_id?: number | null;
    request_time: string;
    dispatch_time?: string | null;
    completion_time?: string | null;
    created_at: string;
    updated_at: string;
    // visit?: Visit | null;
    // vehicle?: Vehicle | null;
}