import { tokens } from '@tamagui/themes/v3'

export default function Demo() {
  console.log('tamgag token', tokens)

  return (
    <div className="w-full h-full">
      <iframe src="https://lucide.dev/icons/" width="100%" height="600px"></iframe>
    </div>
  )
}
