/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  export interface ViewProps {
    className?: string;
  }
  export interface TextProps {
    className?: string;
  }
  export interface PressableProps {
    className?: string;
  }
  export interface ImageProps {
    className?: string;
  }
  export interface ScrollViewProps {
    className?: string;
  }
}

