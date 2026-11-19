import { Route } from 'lucide-react'
import { NewTripDialog } from './new-trip-dialog'

export function EmptyState({ onCreated }: { onCreated: (id: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Route className="size-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-balance">Plan your first carpool</h1>
        <p className="max-w-sm text-sm text-muted-foreground text-pretty">
          Create a trip, add the drivers with open seats, then drop riders into cars.
        </p>
      </div>
      <NewTripDialog onCreated={onCreated} />
    </div>
  )
}
