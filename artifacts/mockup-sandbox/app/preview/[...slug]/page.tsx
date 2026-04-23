'use client';

import { PreviewRenderer } from '@/components/preview-renderer';
import { modules as discoveredModules } from '@/.generated/mockup-components';

export default function PreviewPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const componentPath = params.slug.join('/');

  return (
    <PreviewRenderer
      componentPath={componentPath}
      modules={discoveredModules}
    />
  );
}
