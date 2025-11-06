import { docs } from '@docs/.source';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) {
      return;
    }
    if (icon === 'FoundedLabs') {
      // TODO: add Founded Labs logo for work with us section
      return createElement(icons['Handshake']);
    }

    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});
