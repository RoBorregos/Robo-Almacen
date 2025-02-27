import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FlexibleModalProps {
  title: string
  triggerText: string
  children: React.ReactNode
}

export default function FlexibleModal({ title, triggerText, children }: FlexibleModalProps = { title: 'Modal Title', triggerText: 'Open Modal', children: null }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>{triggerText}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap justify-end gap-2 mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}