'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#FDFDFD]">
      <div className="relative w-96 h-[270px] overflow-hidden mb-6">
        <Image 
          src="/404.png" 
          alt="404 Illustration" 
          fill
          priority
          className="object-cover object-top"
        />
      </div>
      
      <h1 className="text-xl font-semibold text-navy mb-2">Page Not Found</h1>
      
      <p className="text-text-secondary max-w-md mb-8">
        Oops! We couldn't find the page you were looking for. The link might be broken, or the page may have been removed.
      </p>
      
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 bg-navy text-white px-6 py-2.5 rounded-md font-medium hover:bg-navy/90 transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>
    </div>
  )
}
