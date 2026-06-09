import Image from 'next/image'

export function BarangayHeader() {
  return (
    <div className="w-full bg-white border-b border-gray-200 py-4 px-6">
      <div className="relative w-full h-24">
        <Image 
          src="/images/barangay-header.png" 
          alt="Barangay Santiago Header" 
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
