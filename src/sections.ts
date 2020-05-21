import { RefObject } from 'react';

export enum SectionName {
  Splash = 'splash',
  Bio = 'bio',
  History = 'history',
}

export type SectionRefs = Record<SectionName, RefObject<HTMLElement>>;
