import { Draft } from 'immer';

// eslint-disable-next-line no-unused-vars
export type Immer<T> = (draft: Draft<T>) => void;
