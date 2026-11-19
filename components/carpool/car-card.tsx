'use client'

import { Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { actions, type Car, type Rider } from '@/lib/carpool-store'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

type Props = { tripId: string; car: Car; riders: Rider[] }

export function CarCard({ tripId, car, riders }: Props) {
  const full = riders.length >= car.seats
  const seats = Array.from({ length: car.seats }, (_, i) => riders[i] ?? null)

  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {initials(car.driver)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-medium">{car.driver}</h3>
            <p className="truncate text-xs text-muted-foreground">{car.vehicle || 'Driver'}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span
            className={cn(
              'rounded-md px-2 py-0.5 font-mono text-xs',
              full ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground',
            )}
          >
            {full ? 'Full' : `${car.seats - riders.length} open`}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => actions.removeCar(tripId, car.id)}
            aria-label={`Remove ${car.driver}'s car`}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5" role="img" aria-label={`${riders.length} of ${car.seats} seats filled`}>
        {seats.map((r, i) => (
          <span
            key={i}
            className={cn(
              'h-2 flex-1 basis-6 rounded-full',
              r ? 'bg-primary' : 'bg-muted',
            )}
          />
        ))}
      </div>

      {riders.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {riders.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/60 py-1.5 pl-3 pr-1">
              <div className="min-w-0">
                <p className="truncate text-sm">{r.name}</p>
                {r.contact && <p className="truncate text-xs text-muted-foreground">{r.contact}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => actions.assignRider(tripId, r.id, null)}
                aria-label={`Move ${r.name} back to waiting`}
              >
                <X aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No riders yet.</p>
      )}
    </article>
  )
}
