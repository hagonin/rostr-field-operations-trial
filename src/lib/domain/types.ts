export type ResponseStatus = 'invited' | 'accepted' | 'declined' | 'no_response' | 'assigned'
export type LiveStatus = 'checked_in' | 'late' | 'issue' | 'completed'
export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe'
export type ShiftStatus = 'draft' | 'published'

export interface Campaign {
  id: string
  name: string
  clientName: string
  startDate: string | null
  endDate: string | null
  createdAt: string
}

export interface Location {
  id: string
  retailer: string
  storeName: string
  address: string | null
  suburb: string | null
  state: string | null
  country: string
}

export interface Staff {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  roleTitle: string | null
  availabilityStatus: AvailabilityStatus
  distanceKm?: number
}

export interface ShiftRole {
  id: string
  shiftId: string
  role: string
  headcount: number
  breakMinutes: number
}

export interface ShiftAssignment {
  id: string
  shiftId: string
  staffId: string
  staff?: Staff
  role: string | null
  status: ResponseStatus
  responseNote: string | null
  updatedAt: string
  // Presentational dressing — from fixtures, never in DB
  liveStatus?: LiveStatus
  hours?: string
  checkInTime?: string
}

export interface Shift {
  id: string
  campaignId: string | null
  campaign?: Campaign
  locationId: string | null
  location?: Location
  name: string | null
  date: string
  startTime: string
  endTime: string
  roleFocus: string | null
  notes: string | null
  equipment: string | null
  status: ShiftStatus
  createdAt: string
  shiftRoles: ShiftRole[]
  assignments: ShiftAssignment[]
}

export interface ActivityEvent {
  actor: string
  message: string
  relativeTime: string
}
