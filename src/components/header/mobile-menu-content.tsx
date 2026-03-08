'use client'

import Link from 'next/link'
import { Menus } from '@/components/header/menus'
import { SITE_NAME } from '@/constants/app'

interface MobileMenuContentProps {
  onClose: () => void
}

export function MobileMenuContent({ onClose }: MobileMenuContentProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || SITE_NAME
  const logoLetter = siteName.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col gap-4 pt-2">
      <Link href="/" onClick={onClose} className="flex items-center gap-2 border-b pb-4">
        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <span className="text-primary-foreground text-lg font-bold">{logoLetter}</span>
        </div>
        <span className="text-lg font-bold">{siteName}</span>
      </Link>
      <nav className="flex flex-col gap-1">
        <Menus vertical />
      </nav>
    </div>
  )
}
