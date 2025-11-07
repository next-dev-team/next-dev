import { PreviewCarousel } from '@showcase/components/preview-carousel';
import * as React from 'react';
import { FormBasicPreview, FormWithValidationPreview } from '@/rnr-ui/examples';

const formPreviews = [
  { name: 'Basic', component: FormBasicPreview },
  { name: 'With Validation', component: FormWithValidationPreview },
];

export default function FormScreen() {
  return <PreviewCarousel previews={formPreviews} />;
}

