'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { actions, seatsTaken, type Trip } from '@/lib/carpool-store'

export function WaitingRiders({ trip }: { trip: Trip }) {
  const waiting = trip.riders.filter((r) => !r.carId)
  const openCars = trip.cars.filter((c) => seatsTaken(trip, c.id) < c.seats)

  if (waiting.length === 0) {
    return <p className="text-sm text-muted-foreground">Everyone has a seat.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {waiting.map((r) => (
        <li key={r.id} className="flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{r.name}</p>
            {r.contact && <p className="truncate text-xs text-muted-foreground">{r.contact}</p>}
          </div>
          <div className="flex items-center gap-1">
            <label htmlFor={`assign-${r.id}`} className="sr-only">
              Assign {r.name} to a car
            </label>
            <select
              id={`assign-${r.id}`}
              value=""
              disabled={openCars.length === 0}
              onChange={(e) => e.target.value && actions.assignRider(trip.id, r.id, e.target.value)}
              className="h-8 min-w-0 flex-1 rounded-lg border border-input bg-background px-2 text-sm disabled:opacity-50 sm:w-44 sm:flex-none"
            >
              <option value="">{openCars.length ? 'Assign to car…' : 'No open seats'}</option>
              {openCars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.driver} ({c.seats - seatsTaken(trip, c.id)} open)
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => actions.removeRider(trip.id, r.id)}
              aria-label={`Remove ${r.name} from trip`}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
