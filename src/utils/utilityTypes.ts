import { Assign } from 'utility-types';

export type Maybe<T, U extends null | undefined = undefined> = T | U;

export type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
export type Tails<T extends any[]> = T extends [any, ...infer U] ? U : never;

export type Assigns<T extends object[]> =
  T extends [infer H, ...infer U] ?
    H extends object ?
      U extends object[] ?
        Assign<H, Assigns<U>>
      : {}
    : {}
  : T extends [infer H] ? H
  : {};

export type NonChildren<T> = Omit<T, 'children'>;
