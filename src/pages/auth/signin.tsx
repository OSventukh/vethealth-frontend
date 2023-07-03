import dynamic from 'next/dynamic'
const Auth = dynamic(() => import('@/components/admin/Auth'))

export default function SignInPage() {
  return (
    <Auth />
  )
}
