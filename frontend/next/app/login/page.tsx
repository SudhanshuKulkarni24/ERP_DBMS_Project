"use client"

import React, { useState, FormEvent } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Link as ChakraLink,
  useToast,
  Divider,
  HStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } else {
        window.location.href = '/dashboard'
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during sign in',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during Google sign in',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center">Sign In</Heading>
          <Button
            leftIcon={<FaGoogle />}
            colorScheme="red"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>
          <Divider />
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Sign In
              </Button>
            </VStack>
          </form>
          <HStack justify="center" mt={4}>
            <Text>Don't have an account?</Text>
            <Link href="/register">
              <Text color="blue.500">Sign up</Text>
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Container>
  )
}

export default LoginPage

