'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link as ChakraLink,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Field, Formik } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'
export default function RegisterComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const register = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      console.log(data)
      // toast
      if(res.ok){
        toast({
          title: "Success",
          description: "Registered successfully",
          status: "success",
          duration: 9000,
        })
      }
    } catch (error) {
      console.log(error.message)
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
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
              password: ''
            }}
            validationSchema={Yup.object({
              email: Yup.string().email('Invalid email address').required('Email is required'),
              password: Yup.string().required('Password is required').min(6, 'Password is too short - should be 6 chars minimum'),
            })}
            onSubmit={(value, action) => {
              register(value.email, value.password)
              // action.resetForm()
            }}
          >
            {formik => (
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={4}>
                  <FormControl id="email" isRequired
                    isInvalid={!!formik.errors.email && formik.touched.email}
                  >
                    <FormLabel>Email address</FormLabel>
                    <Field
                      type="email"
                      as={Input}
                      name="email"
                      placeholder="Email"
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="password" isRequired
                    isInvalid={!!formik.errors.password && formik.touched.password}
                  >
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...formik.getFieldProps('password')}
                      />
                      <InputRightElement h={'full'}>
                        <Button
                          variant={'ghost'}
                          onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                          }>
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                  </FormControl>
                  <Stack spacing={10} pt={2}>
                    <Button
                      type="submit"
                      isLoading={loading}
                      loadingText="Submitting..."
                      size="md"
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}>
                      Sign up
                    </Button>
                  </Stack>
                  <Stack pt={6}>
                    <Text align={'center'}>
                      Already a user? 
                      <Link href="/login">
                        <Text color={'blue.400'}>
                          Login
                        </Text>
                      </Link>
                    </Text>
                  </Stack>
                </Stack>
              </form>
            )}
          </Formik>

        </Box>
      </Stack>
    </Flex>
  )
}