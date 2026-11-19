'use client'

import { useRef } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { actions } from '@/lib/carpool-store'

export function AddRiderForm({ tripId }: { tripId: string }) {
  const nameRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    if (!name) return
    actions.addRider(tripId, {
      name: name.slice(0, 60),
      contact: String(data.get('contact') ?? '').trim().slice(0, 60),
    })
    form.reset()
    nameRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor={`rider-name-${tripId}`} className="text-xs">
          Rider name
        </Label>
        <Input ref={nameRef} id={`rider-name-${tripId}`} name="name" required maxLength={60} placeholder="Jamie Ortiz" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor={`rider-contact-${tripId}`} className="text-xs">
          Phone or handle
        </Label>
        <Input id={`rider-contact-${tripId}`} name="contact" maxLength={60} placeholder="@jamie" />
      </div>
      <Button type="submit" variant="secondary">
        <UserPlus data-icon="inline-start" aria-hidden="true" />
        Add rider
      </Button>
    </form>
  )
}
