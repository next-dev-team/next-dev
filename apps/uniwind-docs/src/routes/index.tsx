import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        UniWind Docs
      </h1>
      <p className="max-w-md text-lg text-fd-muted-foreground">
        UniWind-powered UI component library documentation for React Native
        Reusables.
      </p>
      <Link
        to="/docs"
        className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground shadow-sm transition-colors hover:bg-fd-primary/90"
      >
        Browse Docs →
      </Link>
    </main>
  );
}
