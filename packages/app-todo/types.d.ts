import { config } from '@my/config'

export type Conf = typeof config

declare module '@next-dev/rn-ui' {
  interface TamaguiCustomConfig extends Conf {}
}
