import { Button } from '@docs/components/ui/button';
import { source } from '@docs/lib/source';
import mdxComponents from '@docs/mdx-components';
import { findNeighbour } from 'fumadocs-core/server';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const doc = page.data;
  const MDX = doc.body;

  return (
    <DocsPage
      toc={doc.toc}
      full={doc.full}
      breadcrumb={{ enabled: false }}
      footer={{
        component: <Footer url={page.url} />,
      }}>
      <DocsBody>
        <div className="flex items-center justify-between gap-2">
          <DocsTitle className="mb-0 font-semibold">{doc.title}</DocsTitle>
          <NeighbourButtons url={page.url} />
        </div>
        <DocsDescription className="mb-4 mt-2.5 text-base">{doc.description}</DocsDescription>
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

function NeighbourButtons({ url }: { url: string }) {
  const neighbours = findNeighbour(source.pageTree, url);

  const isManualInstallation = url === '/docs/installation/manual';

  return (
    <div className="flex items-center gap-2">
      {neighbours.previous || isManualInstallation ? (
        <Button variant="outline" size="icon" className="border-border/70 size-8" asChild>
          <Link href={neighbours.previous?.url || '/docs'}>
            <ArrowLeftIcon />
          </Link>
        </Button>
      ) : null}
      {neighbours.next || isManualInstallation ? (
        <Button variant="outline" size="icon" className="border-border/70 size-8" asChild>
          <Link href={neighbours.next?.url || '/docs/customization'}>
            <ArrowRightIcon />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

function Footer({ url }: { url: string }) {
  const neighbours = findNeighbour(source.pageTree, url);

  const isManualInstallation = url === '/docs/installation/manual';

  return (
    <footer>
      <div className="flex h-16 w-full items-center justify-between gap-2">
        {neighbours.previous || isManualInstallation ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="bg-fd-accent hover:bg-fd-accent/80 dark:hover:bg-fd-accent/80">
            <Link href={neighbours.previous?.url || '/docs'}>
              <ArrowLeftIcon />
              {neighbours.previous?.name || 'Introduction'}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {neighbours.next || isManualInstallation ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="bg-fd-accent hover:bg-fd-accent/80 dark:hover:bg-fd-accent/80">
            <Link href={neighbours.next?.url || '/docs/customization'}>
              {neighbours.next?.name || 'Customization'}
              <ArrowRightIcon />
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="flex h-20 items-center justify-between">
        <div className="text-fd-muted-foreground w-full text-balance px-4 text-center text-xs leading-loose lg:text-sm">
          Built by{' '}
          <a
            href="https://x.com/mrzachnugent"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            mrzachnugent
          </a>{' '}
          at{' '}
          <a
            href="https://foundedlabs.com"
            target="_blank"
            rel="noreferrer"
            className="decoration-fd-muted-foreground/0 hover:decoration-fd-muted-foreground underline underline-offset-4">
            Founded Labs
          </a>
          , bringing{' '}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            shadcn/ui
          </a>{' '}
          to React Native. Source on{' '}
          <a
            href="https://github.com/gabimoncha/rnr-registry-template"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            GitHub
          </a>
          .
        </div>
      </div>
    </footer>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
