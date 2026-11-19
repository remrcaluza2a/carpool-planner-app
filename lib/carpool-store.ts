'use client'

import { useSyncExternalStore } from 'react'

export type Rider = {
  id: string
  name: string
  contact: string
  carId: string | null
}

export type Car = {
  id: string
  driver: string
  vehicle: string
  seats: number
}

export type Trip = {
  id: string
  name: string
  destination: string
  meetingPoint: string
  date: string
  time: string
  notes: string
  cars: Car[]
  riders: Rider[]
  createdAt: number
}

type State = { trips: Trip[] }

const STORAGE_KEY = 'carpool-planner:v1'
const listeners = new Set<() => void>()
const SERVER_STATE: State = { trips: [] }
let state: State | null = null

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

function seed(): State {
  const today = new Date()
  const friday = new Date(today)
  friday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7 || 7))
  const carA = uid()
  const carB = uid()
  return {
    trips: [
      {
        id: uid(),
        name: 'Weekend hike at Eagle Ridge',
        destination: 'Eagle Ridge Trailhead',
        meetingPoint: 'Student Union parking lot',
        date: friday.toISOString().slice(0, 10),
        time: '08:30',
        notes: 'Bring water and snacks. Split gas money with your driver.',
        createdAt: Date.now(),
        cars: [
          { id: carA, driver: 'Maya Chen', vehicle: 'Blue Honda Civic', seats: 4 },
          { id: carB, driver: 'Jordan Lee', vehicle: 'Grey Toyota RAV4', seats: 3 },
        ],
        riders: [
          { id: uid(), name: 'Priya Patel', contact: '@priya', carId: carA },
          { id: uid(), name: 'Sam Rivera', contact: '555-0142', carId: carA },
          { id: uid(), name: 'Alex Kim', contact: '@alexk', carId: carB },
          { id: uid(), name: 'Noah Brooks', contact: '555-0199', carId: null },
          { id: uid(), name: 'Lena Fischer', contact: '@lena.f', carId: null },
        ],
      },
    ],
  }
}

function load(): State {
  if (state) return state
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    state = raw ? (JSON.parse(raw) as State) : seed()
  } catch {
    state = seed()
  }
  return state
}

function setState(updater: (prev: State) => State) {
  state = updater(load())
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCarpool() {
  return useSyncExternalStore(subscribe, load, () => SERVER_STATE)
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

function updateTrip(tripId: string, fn: (trip: Trip) => Trip) {
  setState((prev) => ({
    trips: prev.trips.map((t) => (t.id === tripId ? fn(t) : t)),
  }))
}

export function seatsTaken(trip: Trip, carId: string) {
  return trip.riders.filter((r) => r.carId === carId).length
}

export function tripStats(trip: Trip) {
  const totalSeats = trip.cars.reduce((sum, c) => sum + c.seats, 0)
  const assigned = trip.riders.filter((r) => r.carId).length
  return {
    totalSeats,
    assigned,
    waiting: trip.riders.length - assigned,
    openSeats: totalSeats - assigned,
  }
}

export const actions = {
  addTrip(input: Omit<Trip, 'id' | 'cars' | 'riders' | 'createdAt'>) {
    const id = uid()
    setState((prev) => ({
      trips: [{ ...input, id, cars: [], riders: [], createdAt: Date.now() }, ...prev.trips],
    }))
    return id
  },
  deleteTrip(tripId: string) {
    setState((prev) => ({ trips: prev.trips.filter((t) => t.id !== tripId) }))
  },
  addCar(tripId: string, car: Omit<Car, 'id'>) {
    updateTrip(tripId, (t) => ({ ...t, cars: [...t.cars, { ...car, id: uid() }] }))
  },
  removeCar(tripId: string, carId: string) {
    updateTrip(tripId, (t) => ({
      ...t,
      cars: t.cars.filter((c) => c.id !== carId),
      riders: t.riders.map((r) => (r.carId === carId ? { ...r, carId: null } : r)),
    }))
  },
  addRider(tripId: string, rider: Omit<Rider, 'id' | 'carId'>) {
    updateTrip(tripId, (t) => ({
      ...t,
      riders: [...t.riders, { ...rider, id: uid(), carId: null }],
    }))
  },
  removeRider(tripId: string, riderId: string) {
    updateTrip(tripId, (t) => ({ ...t, riders: t.riders.filter((r) => r.id !== riderId) }))
  },
  assignRider(tripId: string, riderId: string, carId: string | null) {
    updateTrip(tripId, (t) => {
      if (carId) {
        const car = t.cars.find((c) => c.id === carId)
        if (!car || seatsTaken(t, carId) >= car.seats) return t
      }
      return { ...t, riders: t.riders.map((r) => (r.id === riderId ? { ...r, carId } : r)) }
    })
  },
  autoAssign(tripId: string) {
    updateTrip(tripId, (t) => {
      const taken = new Map(t.cars.map((c) => [c.id, seatsTaken(t, c.id)]))
      const riders = t.riders.map((r) => {
        if (r.carId) return r
        const target = t.cars
          .filter((c) => (taken.get(c.id) ?? 0) < c.seats)
          .sort((a, b) => (taken.get(a.id) ?? 0) / a.seats - (taken.get(b.id) ?? 0) / b.seats)[0]
        if (!target) return r
        taken.set(target.id, (taken.get(target.id) ?? 0) + 1)
        return { ...r, carId: target.id }
      })
      return { ...t, riders }
    })
  },
}
