import { PreviewCarousel } from '@showcase/components/preview-carousel';
import * as React from 'react';
import { RedButtonPreview, RedButtonSecondaryPreview } from '@/example-library/examples/red-button';

const exampleComponentPreviews = [
  { name: 'Default', component: RedButtonPreview },
  { name: 'Secondary', component: RedButtonSecondaryPreview },
];

export default function ExampleComponentScreen() {
  return <PreviewCarousel previews={exampleComponentPreviews} />;
}
