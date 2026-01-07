"use client"
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ErrorPage() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/')
  }
  return (
    <div className='h-screen flex flex-col gap-2 items-center justify-center'>
      <AlertTriangle className='size-6'/>
      <span className='text-lg '>
        Something went wrong
      </span>
      <Button onClick={handleClick} className='cursor-pointer' variant={'secondary'}>Go Back</Button>
    </div>
  )
}
