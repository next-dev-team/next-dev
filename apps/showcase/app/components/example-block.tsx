import { PreviewCarousel } from '@showcase/components/preview-carousel';
import * as React from 'react';
import { MultipleButtons } from '@/example-library/blocks/multiple-buttons';

const exampleBlockPreviews = [{ name: 'Multiple Buttons', component: MultipleButtons }];

export default function ExampleBlockScreen() {
  return <PreviewCarousel previews={exampleBlockPreviews} />;
}
