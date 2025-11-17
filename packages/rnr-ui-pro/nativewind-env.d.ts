/// <reference types="nativewind/types" />

import type {} from 'react-native';

declare module 'react-native' {
  export interface ViewProps {
    className?: string;
  }
  export interface TextProps {
    className?: string;
  }
  export interface ImageProps {
    className?: string;
  }
  export interface PressableProps {
    className?: string;
  }
  export interface ScrollViewProps {
    className?: string;
  }
  export interface FlatListProps<ItemT> {
    className?: string;
  }
}

