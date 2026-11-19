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
import { Textarea } from '@/components/ui/textarea'
import { actions } from '@/lib/carpool-store'

export function NewTripDialog({ onCreated }: { onCreated: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    if (!name) return
    const id = actions.addTrip({
      name: name.slice(0, 80),
      destination: String(data.get('destination') ?? '').trim().slice(0, 120),
      meetingPoint: String(data.get('meetingPoint') ?? '').trim().slice(0, 120),
      date: String(data.get('date') ?? ''),
      time: String(data.get('time') ?? ''),
      notes: String(data.get('notes') ?? '').trim().slice(0, 500),
    })
    setOpen(false)
    onCreated(id)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" aria-hidden="true" />
        New trip
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New trip</DialogTitle>
            <DialogDescription>Where is the group headed?</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-name">Trip name</Label>
            <Input id="trip-name" name="name" required maxLength={80} placeholder="Game day at State" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-destination">Destination</Label>
            <Input id="trip-destination" name="destination" maxLength={120} placeholder="Memorial Stadium" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-meeting">Meeting point</Label>
            <Input id="trip-meeting" name="meetingPoint" maxLength={120} placeholder="Dorm B front entrance" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="trip-date">Date</Label>
              <Input id="trip-date" name="date" type="date" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="trip-time">Departure</Label>
              <Input id="trip-time" name="time" type="time" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-notes">Notes</Label>
            <Textarea id="trip-notes" name="notes" maxLength={500} placeholder="Gas split, what to bring…" />
          </div>
          <DialogFooter>
            <Button type="submit">Create trip</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
