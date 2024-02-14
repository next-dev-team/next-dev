import { UserDetailScreen } from '@next-dev/app/features/user/detail-screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <UserDetailScreen />
    </>
  )
}
