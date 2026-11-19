import { CalendarDays, MapPin } from 'lucide-react'
import { type Trip, tripStats } from '@/lib/carpool-store'
import { formatTripDate } from '@/lib/format'
import { cn } from '@/lib/utils'

type Props = {
  trips: Trip[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TripList({ trips, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Trips ({trips.length})
      </h2>
      <ul className="flex flex-col gap-2">
        {trips.map((trip) => {
          const stats = tripStats(trip)
          const active = trip.id === selectedId
          return (
            <li key={trip.id}>
              <button
                type="button"
                onClick={() => onSelect(trip.id)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full flex-col gap-2 rounded-xl border bg-card p-3 text-left transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-ring',
                  active && 'lg:border-primary lg:ring-1 lg:ring-primary',
                )}
              >
                <span className="font-medium leading-snug text-pretty">{trip.name}</span>
                <span className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{trip.destination || 'Destination TBD'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
                    {formatTripDate(trip.date, trip.time)}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono">
                    {stats.assigned}/{stats.totalSeats} seats
                  </span>
                  {stats.waiting > 0 && (
                    <span className="rounded-md bg-primary/15 px-1.5 py-0.5 font-medium text-foreground">
                      {stats.waiting} waiting
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
