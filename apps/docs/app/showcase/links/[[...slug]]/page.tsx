import { RnrIcon } from '@docs/components/icons/rnr-icon';

export default async function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center p-2">
      <div className="bg-card not-prose flex flex-col-reverse items-center justify-between gap-6 rounded-xl border p-12 shadow-sm sm:gap-8 lg:flex-row lg:p-14">
        <div className={'flex max-w-xs flex-col items-center justify-center gap-8 lg:items-start'}>
          <div>
            <h1 className="pb-1 text-center text-3xl font-medium lg:text-left lg:text-4xl">
              Showcase your components through an app
            </h1>
            <p className="text-muted-foreground text-center text-base lg:text-left">
              You can link this page to your app to showcase your components.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="border-border/0 dark:border-border flex items-center justify-center rounded-3xl border bg-black p-4 shadow-md md:rounded-[2.5rem] md:p-6">
            <RnrIcon className="size-16 text-white md:size-32" pathClassName="stroke-1" />
          </div>
        </div>
      </div>
    </main>
  );
}
