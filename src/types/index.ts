export interface RoutesProps {
  path: string;
  exact?: boolean;
  strict?: boolean;
  element: React.ComponentType<any>;
  authComp?: React.ComponentType<any>;
}
export type ChainType = 'ERC' | 'AELF';
