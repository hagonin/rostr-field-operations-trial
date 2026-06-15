'use server'
import { timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { createSupabaseAdminClient } from './supabase'

// ── Admin auth ───────────────────────────────────────────────────────────────

export async function verifyAdminPasscode(formData: FormData): Promise<void> {
  const submitted = String(formData.get('passcode') ?? '')
  const expected  = process.env.ADMIN_PASSCODE ?? ''

  // Constant-time comparison — prevents timing-based enumeration of the passcode
  const a = Buffer.from(submitted)
  const b = Buffer.from(expected)
  const lengthMatch = a.length === b.length
  // Always run timingSafeEqual (on same-length buffers) to avoid short-circuit leaks
  const bytesMatch = timingSafeEqual(
    Buffer.from(submitted.padEnd(expected.length || 1)),
    Buffer.from(expected.padEnd(submitted.length || 1))
  )

  if (!lengthMatch || !bytesMatch) {
    redirect('/admin/login?error=1')
  }

  const cookieStore = await cookies()
  cookieStore.set('adminAuth', '1', {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  redirect('/admin')
}

export async function adminLogout(): Promise<never> {
  const cookieStore = await cookies()
  cookieStore.delete('adminAuth')
  redirect('/admin/login')
}

// ── Role-picker / session ────────────────────────────────────────────────────

export async function setCurrentStaff(staffId: string): Promise<never> {
  const cookieStore = await cookies()
  cookieStore.set('currentStaffId', staffId, {
    path: '/',
    httpOnly: true,
    maxAge: 86400,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  redirect('/staff')
}

export async function enterAdmin(): Promise<never> {
  const cookieStore = await cookies()
  cookieStore.delete('currentStaffId')
  redirect('/admin')
}

// ── Shift write types ────────────────────────────────────────────────────────

export interface ShiftRoleInput {
  role: string
  headcount: number
  breakMinutes: number
}

export interface ShiftInput {
  name: string
  campaignId: string
  locationId: string
  roleFocus: string
  equipment: string
  notes: string
  date: string
  startTime: string
  endTime: string
  roles: ShiftRoleInput[]
}

// ── Shift mutations ──────────────────────────────────────────────────────────

export async function createShift(input: ShiftInput): Promise<never> {
  const db = createSupabaseAdminClient()
  const { data: shift, error } = await db
    .from('shifts')
    .insert({
      campaign_id: input.campaignId || null,
      location_id: input.locationId || null,
      name: input.name || null,
      date: input.date,
      start_time: input.startTime,
      end_time: input.endTime,
      role_focus: input.roleFocus || null,
      notes: input.notes || null,
      equipment: input.equipment || null,
      status: 'published',
    })
    .select('id')
    .single()
  if (error) throw error

  if (input.roles.length > 0) {
    const { error: re } = await db.from('shift_roles').insert(
      input.roles.map(r => ({
        shift_id: shift.id,
        role: r.role,
        headcount: r.headcount,
        break_minutes: r.breakMinutes,
      }))
    )
    if (re) throw re
  }

  revalidatePath('/admin')
  updateTag('shifts')
  redirect(`/admin/shifts/${shift.id}`)
}

export async function updateShift(id: string, input: ShiftInput): Promise<never> {
  const db = createSupabaseAdminClient()
  const { error } = await db.from('shifts').update({
    campaign_id: input.campaignId || null,
    location_id: input.locationId || null,
    name: input.name || null,
    date: input.date,
    start_time: input.startTime,
    end_time: input.endTime,
    role_focus: input.roleFocus || null,
    notes: input.notes || null,
    equipment: input.equipment || null,
  }).eq('id', id)
  if (error) throw error

  await db.from('shift_roles').delete().eq('shift_id', id)
  if (input.roles.length > 0) {
    await db.from('shift_roles').insert(
      input.roles.map(r => ({
        shift_id: id,
        role: r.role,
        headcount: r.headcount,
        break_minutes: r.breakMinutes,
      }))
    )
  }

  revalidatePath('/admin')
  revalidatePath(`/admin/shifts/${id}`)
  updateTag('shifts')
  redirect(`/admin/shifts/${id}`)
}

export async function switchUser(): Promise<never> {
  const cookieStore = await cookies()
  cookieStore.delete('currentStaffId')
  redirect('/')
}

export async function respondToShift(assignmentId: string, response: 'accepted' | 'declined'): Promise<void> {
  const cookieStore = await cookies()
  const sessionStaffId = cookieStore.get('currentStaffId')?.value
  if (!sessionStaffId) throw new Error('Unauthorized')

  const db = createSupabaseAdminClient()
  // Constrain by staff_id so a staff member can only update their own assignments
  const { error } = await db
    .from('shift_assignments')
    .update({ status: response })
    .eq('id', assignmentId)
    .eq('staff_id', sessionStaffId)
  if (error) throw error
  revalidatePath('/staff')
  revalidatePath('/admin')
  updateTag('shifts')
}

export async function setAvailability(staffId: string, status: 'available' | 'unavailable' | 'maybe'): Promise<void> {
  const cookieStore = await cookies()
  const sessionStaffId = cookieStore.get('currentStaffId')?.value
  if (!sessionStaffId || sessionStaffId !== staffId) throw new Error('Unauthorized')

  const db = createSupabaseAdminClient()
  const { error } = await db.from('staff').update({ availability_status: status }).eq('id', staffId)
  if (error) throw error
  revalidatePath('/staff')
  revalidatePath('/admin')
  updateTag('shifts')
}

export async function inviteStaff(shiftId: string, staffIds: string[]): Promise<void> {
  if (!staffIds.length) return
  const db = createSupabaseAdminClient()
  
  // Fetch staff role_titles to populate the role column
  const { data: staffList, error: staffError } = await db
    .from('staff')
    .select('id, role_title')
    .in('id', staffIds)
  if (staffError) throw staffError

  const roleByStaffId = new Map<string, string>()
  for (const s of (staffList ?? [])) {
    if (s.role_title) {
      roleByStaffId.set(s.id, s.role_title)
    }
  }

  const { error } = await db.from('shift_assignments').insert(
    staffIds.map(staffId => ({
      shift_id: shiftId,
      staff_id: staffId,
      role: roleByStaffId.get(staffId) || null,
      status: 'invited'
    }))
  )
  if (error) throw error
  revalidatePath(`/admin/shifts/${shiftId}`)
  revalidatePath('/admin')
  updateTag('shifts')
}
