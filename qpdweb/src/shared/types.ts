import type { Draft } from 'immer';

export type Immer<T> = (draft: Draft<T>) => void;
