import { ExplorerClient } from '../../_features/ExplorerClient';

// Next.js 15: route params arrive as a promise.
export default async function ComponentPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return <ExplorerClient route={{ kind: 'component', tag }} />;
}
