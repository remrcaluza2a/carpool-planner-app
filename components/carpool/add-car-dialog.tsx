'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { actions } from '@/lib/carpool-store'

export function AddCarDialog({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const driver = String(data.get('driver') ?? '').trim()
    const seats = Math.floor(Number(data.get('seats')))
    if (!driver || !Number.isFinite(seats) || seats < 1 || seats > 12) return
    actions.addCar(tripId, {
      driver: driver.slice(0, 60),
      vehicle: String(data.get('vehicle') ?? '').trim().slice(0, 60),
      seats,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Plus data-icon="inline-start" aria-hidden="true" />
        Add car
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Add a driver</DialogTitle>
            <DialogDescription>Count only the seats available for riders.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="car-driver">Driver name</Label>
            <Input id="car-driver" name="driver" required maxLength={60} placeholder="Maya Chen" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="car-vehicle">Car</Label>
            <Input id="car-vehicle" name="vehicle" maxLength={60} placeholder="Blue Honda Civic" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="car-seats">Open passenger seats</Label>
            <Input id="car-seats" name="seats" type="number" min={1} max={12} defaultValue={4} required />
          </div>
          <DialogFooter>
            <Button type="submit">Add car</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
