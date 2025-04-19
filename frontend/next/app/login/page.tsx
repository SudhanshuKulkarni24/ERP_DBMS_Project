"use client"

import { useState } from 'react'
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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
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
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Welcome Back
          </Heading>
          <Text color="gray.600">Sign in to your account</Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit} w="100%" p={8} borderWidth={1} borderRadius="lg">
          <VStack spacing={4}>
            <Button
              w="100%"
              leftIcon={<FaGoogle />}
              onClick={handleGoogleSignIn}
              colorScheme="red"
              variant="outline"
            >
              Sign in with Google
            </Button>

            <HStack w="100%">
              <Divider />
              <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
                or continue with email
              </Text>
              <Divider />
            </HStack>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" width="100%" mt={4}>
              Sign In
            </Button>

            <Text>
              Don't have an account?{' '}
              <Link href="/register" passHref>
                <ChakraLink color="blue.500">Register here</ChakraLink>
              </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

