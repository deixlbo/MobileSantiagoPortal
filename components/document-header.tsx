import Image from "next/image"

interface DocumentHeaderProps {
  title?: string
  printOnly?: boolean
}

export function DocumentHeader({ title, printOnly = false }: DocumentHeaderProps) {
  return (
    <div className={`mb-6 ${printOnly ? 'hidden print:block' : ''}`}>
      {/* Header with logos */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Left Logo - Santiago Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/images/santiagologo.jpg"
            alt="Barangay Santiago"
            width={60}
            height={60}
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
        
        {/* Center Text */}
        <div className="text-center flex-1">
          <p className="text-xs sm:text-sm">Republic of the Philippines</p>
          <p className="text-xs sm:text-sm">Province of Zambales</p>
          <p className="text-xs sm:text-sm">Municipality of San Antonio</p>
          <p className="text-xs sm:text-sm font-semibold">Barangay Santiago</p>
        </div>
        
        {/* Right Logo - Municipal Mayor Seal */}
        <div className="flex-shrink-0">
          <Image
            src="/images/saz.jpg"
            alt="Office of the Municipal Mayor"
            width={60}
            height={60}
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
      </div>
      
      {/* Title */}
      {title && (
        <div className="border-t border-b border-black py-3 my-4">
          <h2 className="text-center font-bold text-sm sm:text-base">{title}</h2>
        </div>
      )}
    </div>
  )
}
