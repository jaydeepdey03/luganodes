'use client'

import { Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Heading, Text, useToast } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"

export default function Dashboard() {
    const { address, isConnected } = useAccount()
    const router = useRouter()
    const toast = useToast()
    const logout = async()=> {
        try {
            const res = await fetch('http://localhost:5000/api/logout')
            const data = await res.json()
            console.log(data)
            router.push('/login')
            toast({
                title: "Success",
                description: "Logged out successfully",
                status: "success",
                duration: 9000,
            })
        } catch (error) {
            console.log(error.message)
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }
    return (
        <Center p="7" h="100vh">
            <Card align='center' maxW="xl">
                <CardHeader>
                    <Heading size='md'> Customer Details</Heading>
                </CardHeader>
                <CardBody>
                    <Text size="xs" textAlign={"center"}>Your address</Text>
                    <Text>{address}</Text>
                </CardBody>
                <CardFooter>
                    <Button colorScheme='blue' onClick={logout}>Logout</Button>
                </CardFooter>
            </Card>
        </Center>
    )
}
