import { config } from '@my/config'
import { Button, TamaguiProvider } from 'tamagui'
export default function Demo() {
  return (
    <TamaguiProvider config={config}>
      <Button>d</Button>
    </TamaguiProvider>
  )
}
