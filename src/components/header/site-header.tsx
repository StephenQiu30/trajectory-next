'use client'

import * as React from 'react'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SiteLogo } from '@/components/header/site-logo'
import { Menus } from '@/components/header/menus'
import { MobileMenuContent } from '@/components/header/mobile-menu-content'
import { HeaderActions } from '@/components/header/header-actions'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full border-b border-[color:var(--header-border)] bg-[var(--header-bg)] backdrop-blur-xl">
      <div className="shell-container flex h-[var(--header-height)] items-center">
        <div className="flex flex-1 items-center gap-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-transparent lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="glass w-full max-w-xs overflow-y-auto border-none">
              <MobileMenuContent onClose={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <SiteLogo showText={true} className="hidden shrink-0 sm:flex" />
          <SiteLogo showText={false} className="shrink-0 sm:hidden" />
        </div>

        <nav className="hidden items-center justify-center lg:flex">
          <Menus />
        </nav>

        <div className="flex flex-1 items-center justify-end">
          <HeaderActions authModalOpen={authModalOpen} onAuthModalOpenChange={setAuthModalOpen} />
        </div>
      </div>
    </header>
  )
}
