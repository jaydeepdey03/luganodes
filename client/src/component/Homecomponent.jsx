'use client'

import { Button, Center } from "@chakra-ui/react"
import { useRouter } from "next/navigation"

const Homecomponent = () => {
    const router = useRouter()
    return (
        <Center h="100vh">
            <Button onClick={() => router.push('/login')}>
                Login
            </Button>
        </Center>
    )
}

export default Homecomponent
