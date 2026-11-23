import { ExplorerClient } from '../_features/ExplorerClient';

export const metadata = { title: 'Components | Nova UI' };

export default function ComponentsIndex() {
  return <ExplorerClient route={{ kind: 'catalogue' }} />;
}
