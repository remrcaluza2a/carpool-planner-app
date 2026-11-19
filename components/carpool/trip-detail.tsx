'use client'

import { ArrowLeft, CalendarDays, Flag, MapPin, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { actions, tripStats, type Trip } from '@/lib/carpool-store'
import { formatTripDate } from '@/lib/format'
import { AddCarDialog } from './add-car-dialog'
import { AddRiderForm } from './add-rider-form'
import { CarCard } from './car-card'
import { WaitingRiders } from './waiting-riders'

type Props = { trip: Trip; onBack: () => void; onDeleted: () => void }

export function TripDetail({ trip, onBack, onDeleted }: Props) {
  const stats = tripStats(trip)
  const canAutoAssign = stats.waiting > 0 && stats.openSeats > 0

  const handleDelete = () => {
    if (window.confirm(`Delete "${trip.name}"? This can't be undone.`)) {
      actions.deleteTrip(trip.id)
      onDeleted()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 lg:justify-end">
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            All trips
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-muted-foreground">
            <Trash2 data-icon="inline-start" aria-hidden="true" />
            Delete trip
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">{trip.name}</h1>
          <dl className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Destination</dt>
              <Flag className="size-4 shrink-0" aria-hidden="true" />
              <dd className="truncate">{trip.destination || 'Destination TBD'}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Meeting point</dt>
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <dd className="truncate">{trip.meetingPoint || 'Meeting point TBD'}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Departure</dt>
              <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
              <dd>{formatTripDate(trip.date, trip.time)}</dd>
            </div>
          </dl>
          {trip.notes && (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm text-pretty">{trip.notes}</p>
          )}
        </div>

        <dl className="grid grid-cols-3 gap-2">
          {[
            { label: 'Cars', value: trip.cars.length },
            { label: 'Seats filled', value: `${stats.assigned}/${stats.totalSeats}` },
            { label: 'Waiting', value: stats.waiting },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5 rounded-xl border bg-card p-3">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="font-mono text-xl font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section aria-labelledby="cars-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 id="cars-heading" className="text-lg font-semibold">
            Cars
          </h2>
          <AddCarDialog tripId={trip.id} />
        </div>
        {trip.cars.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No drivers yet. Add a car to start filling seats.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {trip.cars.map((car) => (
              <CarCard
                key={car.id}
                tripId={trip.id}
                car={car}
                riders={trip.riders.filter((r) => r.carId === car.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="riders-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 id="riders-heading" className="text-lg font-semibold">
            Waiting for a seat
          </h2>
          <Button size="sm" onClick={() => actions.autoAssign(trip.id)} disabled={!canAutoAssign}>
            <Sparkles data-icon="inline-start" aria-hidden="true" />
            Auto-assign
          </Button>
        </div>
        <WaitingRiders trip={trip} />
        <div className="rounded-xl border bg-muted/40 p-3">
          <AddRiderForm tripId={trip.id} />
        </div>
      </section>
    </div>
  )
}
