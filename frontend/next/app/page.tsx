'use client'

import { Box, Container, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { FaBook, FaCalendarAlt, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Course Management System
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Streamline your academic journey with our comprehensive course management platform
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <FeatureCard
            icon={<FaBook />}
            title="Course Registration"
            description="Browse and register for available courses with ease"
          />
          <FeatureCard
            icon={<FaCalendarAlt />}
            title="Timetable Management"
            description="View and manage your class schedule efficiently"
          />
          <FeatureCard
            icon={<FaUserGraduate />}
            title="Student Dashboard"
            description="Track your progress, assignments, and announcements"
          />
          <FeatureCard
            icon={<FaChalkboardTeacher />}
            title="Teacher Portal"
            description="Manage courses, assignments, and student progress"
          />
        </SimpleGrid>
      </VStack>
    </Container>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
    >
      <VStack spacing={4} align="start">
        <Box fontSize="2xl" color="blue.500">
          {icon}
        </Box>
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{description}</Text>
      </VStack>
    </Box>
  )
}

