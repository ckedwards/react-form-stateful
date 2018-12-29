import { createContext } from 'react';
import { State } from './types';
import { SFActions } from './actions';

interface SFContext {
  readonly stateRef: { current: State };
  readonly dispatch: (action: SFActions) => void;
}

export const SFContext = createContext<SFContext | null>(null);
