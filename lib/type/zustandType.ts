import { StateCreator } from 'zustand';

export type StateSetter<T> = Parameters<StateCreator<T>>[0];
