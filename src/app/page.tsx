import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, GitHubLogoIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Logo } from '@/components';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[50] w-full border-b border-border/40 bg-background/95 backdrop-blur-sm dark:bg-black/[0.6]">
        <div className="container flex h-14 items-center">
          <Link
            href="/"
            className="flex items-center justify-start transition-opacity duration-300 hover:opacity-85"
          >
            <Logo />
            <span className="ml-1 font-bold">Solafund</span>
            <span className="sr-only ml-1">Solafund</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-background"
              asChild
            >
              <Link href="https://github.com/Kds-JS/solafund">
                <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
              </Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              Empower Projects with SolaFund
            </h1>
            <span className="max-w-[750px] text-center text-lg font-light text-foreground">
              Empowering innovation through decentralized crowdfunding on the
              Solana blockchain. Solafund connects creators with supporters
              globally, ensuring secure, transparent, and fast transactions for
              projects of all sizes.
            </span>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <Button variant="default" asChild>
                <Link href="/dashboard/campaigns/new">
                  Dashboard
                  <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/campaigns">See All Campaigns</Link>
              </Button>
            </div>
          </section>
          <div className="relative flex w-full justify-center">
            <Image
              src="/mdwhite.png"
              width={1080}
              height={608}
              alt="demo"
              priority
              className="rounded-xl border shadow-sm dark:hidden"
            />
            <Image
              src="/mdblack.png"
              width={1080}
              height={608}
              alt="demo-dark"
              priority
              className="hidden rounded-xl border border-zinc-600 shadow-sm dark:block dark:shadow-gray-500/5"
            />
            <Image
              src="/smwhite.png"
              width={228}
              height={494}
              alt="demo-mobile"
              className="absolute bottom-0 right-0 hidden rounded-xl border dark:hidden lg:block"
            />
            <Image
              src="/smblack.png"
              width={228}
              height={494}
              alt="demo-mobile"
              className="absolute bottom-0 right-0 hidden rounded-xl border border-zinc-600 dark:lg:block"
            />
          </div>
        </div>
      </main>
      <footer className="border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built by{' '}
            <Link
              href="https://www.0xkds.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Kds
            </Link>
            . The source code is available on{' '}
            <Link
              href="https://github.com/Kds-JS/solafund"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
