import { Button, Center } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <Center h="100vh">
      <Button onClick={()=>router.push('/login')}>
        Login
      </Button>
    </Center>
  )
}
