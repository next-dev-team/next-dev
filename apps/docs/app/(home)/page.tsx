import { Button } from '@docs/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      id="nd-page"
      className="max-w-fd-container mx-auto flex w-full flex-col items-center gap-4">
      <div className="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
        <h1 className="text-primary/90 leading-tighter max-w-3xl text-balance text-4xl font-semibold tracking-tight lg:leading-[1.1] xl:max-w-7xl xl:text-5xl xl:font-medium xl:tracking-tighter">
          Build your Universal Component Library
        </h1>
        <figure className="flex flex-col gap-4">
          <Image
            src="/images/registry-light.png"
            width="1432"
            height="960"
            alt="Registry"
            className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
          />
          <Image
            src="/images/registry-dark.png"
            width="1432"
            height="960"
            alt="Registry"
            className="mt-6 hidden w-full overflow-hidden rounded-lg border shadow-sm dark:block"
          />
          <figcaption className="text-center text-sm text-gray-500">
            A distribution system for code
          </figcaption>
        </figure>
        <div className="**:data-[slot=button]:shadow-none flex w-full items-center justify-center gap-2 pt-2">
          <Button asChild size="sm">
            <Link href="/docs">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
