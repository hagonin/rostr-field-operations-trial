import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createSupabaseReadClient } from './supabase'
import { liveStatusByAssignmentId, distanceKmByStaffId, activityFeed } from './presentational-fixtures'
import type { Campaign, Location, Staff, ShiftRole, ShiftAssignment, Shift, ActivityEvent } from '@/lib/domain/types'

// Shift reads pull a deep nested graph — the dominant remote round-trip cost.
// Cache them across requests; bust via the 'shifts' tag on any write that
// touches shift, role, assignment, or staff state (staff is embedded here).
const TAG_SHIFTS = 'shifts'
const REVALIDATE = 60 // seconds

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>

function mapCampaign(r: Row): Campaign {
  return { id: r.id, name: r.name, clientName: r.client_name, startDate: r.start_date, endDate: r.end_date, createdAt: r.created_at }
}

function mapLocation(r: Row): Location {
  return { id: r.id, retailer: r.retailer, storeName: r.store_name, address: r.address, suburb: r.suburb, state: r.state, country: r.country }
}

function mapStaff(r: Row): Staff {
  return {
    id: r.id, fullName: r.full_name, email: r.email, phone: r.phone,
    roleTitle: r.role_title, availabilityStatus: r.availability_status,
    distanceKm: distanceKmByStaffId[r.id],
  }
}

function mapShiftRole(r: Row): ShiftRole {
  return { id: r.id, shiftId: r.shift_id, role: r.role, headcount: r.headcount, breakMinutes: r.break_minutes }
}

function mapAssignment(r: Row): ShiftAssignment {
  const fix = liveStatusByAssignmentId[r.id]
  const staff = r.staff ? mapStaff(r.staff) : undefined
  return {
    id: r.id, shiftId: r.shift_id, staffId: r.staff_id,
    staff,
    role: r.role || staff?.roleTitle,
    status: r.status, responseNote: r.response_note, updatedAt: r.updated_at,
    liveStatus: fix?.status,
    hours: fix?.hours,
    checkInTime: fix?.checkInTime,
  }
}

function mapShift(r: Row): Shift {
  return {
    id: r.id, campaignId: r.campaign_id, locationId: r.location_id,
    campaign: r.campaign ? mapCampaign(r.campaign) : undefined,
    location: r.location ? mapLocation(r.location) : undefined,
    name: r.name, date: r.date, startTime: r.start_time, endTime: r.end_time,
    roleFocus: r.role_focus, notes: r.notes, equipment: r.equipment,
    status: r.status, createdAt: r.created_at,
    shiftRoles: (r.shift_roles ?? []).map(mapShiftRole),
    assignments: (r.shift_assignments ?? []).map(mapAssignment),
  }
}

const SHIFT_SELECT = `
  *, campaign:campaigns(*), location:locations(*),
  shift_roles(*),
  shift_assignments(*, staff:staff(*))
` as const

export const getShifts = cache(
  unstable_cache(
    async (): Promise<Shift[]> => {
      const db = createSupabaseReadClient()
      const { data, error } = await db
        .from('shifts')
        .select(SHIFT_SELECT)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })
      if (error) throw error
      return (data ?? []).map(mapShift)
    },
    ['get-shifts'],
    { tags: [TAG_SHIFTS], revalidate: REVALIDATE },
  )
)

export const getShift = cache(
  unstable_cache(
    async (id: string): Promise<Shift | null> => {
      const db = createSupabaseReadClient()
      const { data, error } = await db.from('shifts').select(SHIFT_SELECT).eq('id', id).single()
      if (error) { if (error.code === 'PGRST116') return null; throw error }
      return mapShift(data)
    },
    ['get-shift'],
    { tags: [TAG_SHIFTS], revalidate: REVALIDATE },
  )
)

export async function getAllStaff(): Promise<Staff[]> {
  const db = createSupabaseReadClient()
  const { data, error } = await db.from('staff').select('*').order('full_name', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapStaff)
}

export async function getCampaigns(): Promise<Campaign[]> {
  const db = createSupabaseReadClient()
  const { data, error } = await db.from('campaigns').select('*').order('name', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapCampaign)
}

export async function getLocations(): Promise<Location[]> {
  const db = createSupabaseReadClient()
  const { data, error } = await db.from('locations').select('*').order('store_name', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapLocation)
}

export async function getStaffById(id: string): Promise<Staff | null> {
  const db = createSupabaseReadClient()
  const { data, error } = await db.from('staff').select('*').eq('id', id).single()
  if (error) { if (error.code === 'PGRST116') return null; throw error }
  return mapStaff(data)
}

export function getActivityFeed(): ActivityEvent[] {
  return activityFeed
}
