'use client'

import { useState } from 'react'
import { CarFront } from 'lucide-react'
import { useCarpool, useHydrated } from '@/lib/carpool-store'
import { NewTripDialog } from './new-trip-dialog'
import { TripList } from './trip-list'
import { TripDetail } from './trip-detail'
import { EmptyState } from './empty-state'
import { cn } from '@/lib/utils'

export function CarpoolApp() {
  const { trips } = useCarpool()
  const hydrated = useHydrated()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileDetail, setMobileDetail] = useState(false)

  const selected = trips.find((t) => t.id === selectedId) ?? trips[0] ?? null

  const openTrip = (id: string) => {
    setSelectedId(id)
    setMobileDetail(true)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CarFront className="size-4" aria-hidden="true" />
            </span>
            <span className="font-semibold tracking-tight">Carpool Planner</span>
          </div>
          <NewTripDialog onCreated={openTrip} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        {!hydrated ? (
          <div className="flex flex-1 flex-col gap-3" aria-busy="true" aria-label="Loading trips">
            <div className="h-24 animate-pulse rounded-xl bg-muted" />
            <div className="h-48 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : trips.length === 0 ? (
          <EmptyState onCreated={openTrip} />
        ) : (
          <>
            <aside
              className={cn('lg:block lg:w-72 lg:shrink-0', mobileDetail ? 'hidden' : 'block')}
              aria-label="Your trips"
            >
              <TripList trips={trips} selectedId={selected?.id ?? null} onSelect={openTrip} />
            </aside>
            {selected && (
              <section
                className={cn('min-w-0 flex-1 lg:block', mobileDetail ? 'block' : 'hidden')}
                aria-label="Trip details"
              >
                <TripDetail
                  key={selected.id}
                  trip={selected}
                  onBack={() => setMobileDetail(false)}
                  onDeleted={() => {
                    setSelectedId(null)
                    setMobileDetail(false)
                  }}
                />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
