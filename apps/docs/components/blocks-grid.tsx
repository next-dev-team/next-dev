import { Button } from '@docs/components/ui/button';
import Link from 'next/link';

const BLOCKS = {
  authentication: [
    { title: 'Sign in form', href: '/docs/blocks/authentication/sign-in-form' },
    { title: 'Sign up form', href: '/docs/blocks/authentication/sign-up-form' },
    { title: 'Verify email form', href: '/docs/blocks/authentication/verify-email-form' },
    { title: 'Reset password form', href: '/docs/blocks/authentication/reset-password-form' },
    { title: 'Forgot password form', href: '/docs/blocks/authentication/forgot-password-form' },
    { title: 'Social connections', href: '/docs/blocks/authentication/social-connections' },
    { title: 'User menu', href: '/docs/blocks/authentication/user-menu' },
  ],
  pricing: [
    { title: 'Pricing 01', href: '/docs/blocks/pricing/pricing-01' },
    { title: 'Pricing 02', href: '/docs/blocks/pricing/pricing-02' },
    { title: 'Pricing 03', href: '/docs/blocks/pricing/pricing-03' },
    { title: 'Pricing 04', href: '/docs/blocks/pricing/pricing-04' },
    { title: 'Pricing 05', href: '/docs/blocks/pricing/pricing-05' },
  ],
  hero: [
    { title: 'Hero 01', href: '/docs/blocks/hero/hero-01' },
    { title: 'Hero 02', href: '/docs/blocks/hero/hero-02' },
    { title: 'Hero 03', href: '/docs/blocks/hero/hero-03' },
    { title: 'Hero 04', href: '/docs/blocks/hero/hero-04' },
    { title: 'Hero 05', href: '/docs/blocks/hero/hero-05' },
  ],
  cards: [
    { title: 'Card 01', href: '/docs/blocks/cards/card-01' },
    { title: 'Card 02', href: '/docs/blocks/cards/card-02' },
    { title: 'Card 03', href: '/docs/blocks/cards/card-03' },
    { title: 'Card 04', href: '/docs/blocks/cards/card-04' },
    { title: 'Card 05', href: '/docs/blocks/cards/card-05' },
  ],
  error: [
    { title: 'Error 01', href: '/docs/blocks/error/error-01' },
    { title: 'Error 02', href: '/docs/blocks/error/error-02' },
    { title: 'Error 03', href: '/docs/blocks/error/error-03' },
    { title: 'Error 04', href: '/docs/blocks/error/error-04' },
    { title: 'Error 05', href: '/docs/blocks/error/error-05' },
  ],
  team: [
    { title: 'Team 01', href: '/docs/blocks/team/team-01' },
    { title: 'Team 02', href: '/docs/blocks/team/team-02' },
    { title: 'Team 03', href: '/docs/blocks/team/team-03' },
    { title: 'Team 04', href: '/docs/blocks/team/team-04' },
    { title: 'Team 05', href: '/docs/blocks/team/team-05' },
  ],
};

export function BlocksGrid({ category = 'authentication' }: { category?: keyof typeof BLOCKS }) {
  const items = BLOCKS[category] || [];

  return (
    <div className="not-prose sm:gird-cols-3 grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map((block) => (
        <Button
          asChild
          size="lg"
          variant="link"
          key={block.href}
          className="justify-start px-0 text-base font-normal">
          <Link href={block.href}>{block.title}</Link>
        </Button>
      ))}
    </div>
  );
}
