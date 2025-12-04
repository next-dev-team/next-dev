declare module "react-native" {
  export const View: any;
  export const Text: any;
  export const Pressable: any;
  export const StyleSheet: {
    create<T extends Record<string, unknown>>(styles: T): T;
  };
}
