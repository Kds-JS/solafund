import Link from 'next/link';
import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Menu } from '@/components/admin-panel/menu';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components';
import { SelectNetwork } from '@/components/admin-panel/select-network';
import { Logo } from '@/components';

export function SheetMenu() {
  const pathName = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button
            className="flex items-center justify-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo />
              <h1 className="text-lg font-bold">Solafund</h1>
            </Link>
          </Button>
        </SheetHeader>
        <div className={pathName.includes('/dashboard') ? 'block' : 'hidden'}>
          <Menu isOpen />
        </div>
        <div className="grow"></div>
        <div className="flex items-center justify-between">
          <ModeToggle />
          <SelectNetwork />
        </div>
      </SheetContent>
    </Sheet>
  );
}
