import { ExplorerClient } from '../../_features/ExplorerClient';

export default async function IconsPage({ params }: { params: Promise<{ family: string }> }) {
  const { family } = await params;
  return <ExplorerClient route={{ kind: 'icons', family: family === 'nova' ? 'nova' : 'material' }} />;
}
