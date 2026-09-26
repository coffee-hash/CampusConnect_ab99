// Seed data for registrations, so the "My Registrations" and Organizer
// pages have something real to display before participants build the
// actual registration flow (Task 2 and Task 3).

export type RegistrationStatus = 'confirmed' | 'cancelled'

export interface Registration {
  id: string
  eventId: string
  studentId: string
  status: RegistrationStatus
  registeredAt: string // ISO date string
}

// NOTE FOR PARTICIPANTS: this array is the "database" of registrations.
// Task 2 (Registration) means pushing new items into this array when a
// student registers. Task 3 (Cancellation) means updating an item's
// status here. Keep using this same array — don't create a second store.
export const registrations: Registration[] = [
  {
    id: 'reg-01',
    eventId: 'evt-01',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-09-10T10:15:00',
  },
  {
    id: 'reg-02',
    eventId: 'evt-04',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-08-20T09:00:00',
  },
  {
    id: 'reg-03',
    eventId: 'evt-09',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-09-12T18:40:00',
  },
]

/** Simple lookup used by the placeholder "My Registrations" page. */
export function getRegistrationsForStudent(studentId: string): Registration[] {
  return registrations.filter((reg) => reg.studentId === studentId)
}

// ============================================================================
// NEW LOGIC ADDED FOR TASK 2 (REGISTRATION) AND TASK 3 (CANCELLATION)
// ============================================================================

/** 
 * Checks if a student is already actively registered for an event (Task 2). 
 * Used to prevent duplicate registrations.
 */
export function hasActiveRegistration(eventId: string, studentId: string): boolean {
  return registrations.some(
    (reg) => reg.eventId === eventId && reg.studentId === studentId && reg.status === 'confirmed'
  )
}

/** 
 * Pushes a new registration into the array (Task 2). 
 */
export function createRegistration(eventId: string, studentId: string): Registration {
  const newRegistration: Registration = {
    // Generate a simple pseudo-unique ID for the mock database
    id: `reg-\({Date.now()}-\){Math.floor(Math.random() * 1000)}`,
    eventId,
    studentId,
    status: 'confirmed',
    registeredAt: new Date().toISOString(),
  }
  
  registrations.push(newRegistration)
  return newRegistration
}

/** 
 * Updates a registration's status to 'cancelled' (Task 3).
 * Returns true if successful, false if the registration wasn't found.
 */
export function cancelRegistration(registrationId: string): boolean {
  const registration = registrations.find((reg) => reg.id === registrationId)
  
  if (registration && registration.status !== 'cancelled') {
    registration.status = 'cancelled'
    return true
  }
  
  return false
}