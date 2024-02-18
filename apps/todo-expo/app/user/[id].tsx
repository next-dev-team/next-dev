import { UserDetailScreen } from '@next-dev/app-todo/features/user/detail-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'User',
        }}
      />
      <UserDetailScreen />
    </>
  )
}
