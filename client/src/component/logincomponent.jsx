import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    chakra,
    useColorModeValue,
    FormErrorMessage,
    useToast,
} from '@chakra-ui/react'
import SignInButton from './SigninButton'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginComponent() {
    const toast = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const login = async (email, password) => {
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        }).then((res) => {
            toast({
                title: "Success",
                description: "Logged in successfully",
                status: "success",
                duration: 9000,
                isCloseable: true,
            })
            router.push('/dashboard')
        }).catch((err) => {
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 9000,
                isCloseable: true,
            })
        }).finally(() => {
            setLoading(false)
        })
    }
    return (
        <Flex
            // suppressHydrationWarning
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to enjoy all of our cool <chakra.span color={'blue.400'}>features</chakra.span> ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}

                        validationSchema={Yup.object({
                            email: Yup.string().email('Invalid email address').required('Required'),
                            password: Yup.string().required('Required'),
                        })}
                        onSubmit={(value, _) => {
                            login(value.email, value.password)
                            // console.log(value)
                            // action.resetForm()
                        }}
                    >
                        {
                            formik => (
                                <form onSubmit={formik.handleSubmit}>
                                    <Stack spacing={4}>
                                        <FormControl id="email" isInvalid={!!formik.errors.email && formik.touched.email}>
                                            <FormLabel>Email address</FormLabel>
                                            <Field as={Input} name={'email'}
                                                placeholder="Enter your email" type="email" />
                                            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                        </FormControl>
                                        <FormControl id="password" isInvalid={!!formik.errors.password && formik.touched.password}>
                                            <FormLabel>Password</FormLabel>
                                            <Field
                                                as={Input}
                                                type="password"
                                                name={'password'}
                                                placeholder='Enter your password'
                                            />
                                            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                                        </FormControl>
                                        <Stack spacing={5}>
                                            <Stack
                                                direction={{ base: 'column', sm: 'row' }}
                                                align={'start'}
                                                justify={'space-between'}>
                                                <Link href="/register">New User?</Link>
                                                <Text color={'blue.400'} as={Link} href="/forgotpassword">Forgot password?</Text>
                                            </Stack>
                                            <Box>
                                                <SignInButton />
                                            </Box>
                                            <Button
                                                type="submit"
                                                isLoading={loading}
                                                loadingText="signing in..."
                                                size="md"
                                                bg={'blue.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}>
                                                Sign in
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </form>
                            )
                        }
                    </Formik>

                </Box>
            </Stack>
        </Flex>
    )
}