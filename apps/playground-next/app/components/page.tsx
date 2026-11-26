import { ExplorerClient } from '../_features/ExplorerClient';

export const metadata = { title: 'Components | Kvui UI' };

export default function ComponentsIndex() {
  return <ExplorerClient route={{ kind: 'catalogue' }} />;
}
