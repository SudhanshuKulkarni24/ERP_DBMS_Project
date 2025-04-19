"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, CheckCircle, Users, Clock, AlertCircle } from "lucide-react"
import { getUserById } from "@/lib/user-service"
import { getEnrollmentsForStudent } from "@/lib/course-service"
import { getAnnouncementsForStudent } from "@/lib/announcement-service"
import { useToast } from "@/hooks/use-toast"
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react'
import { FiBook, FiCalendar, FiUsers, FiBell } from 'react-icons/fi'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [userData, setUserData] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole] = useState<'student' | 'teacher'>('student')

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
      fetchEnrollments()
      fetchAnnouncements()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const user = await getUserById(session!.user.id)
      setUserData(user)
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    }
  }

  const fetchEnrollments = async () => {
    try {
      const data = await getEnrollmentsForStudent(session!.user.id)
      setEnrollments(data)

      // Extract upcoming classes from enrollments
      const today = new Date()
      const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()]

      const classes = []
      for (const enrollment of data) {
        if (enrollment.status === "enrolled") {
          // Get course offering details
          const courseOffering = enrollment.course_offering
          if (courseOffering && courseOffering.schedules) {
            for (const schedule of courseOffering.schedules) {
              if (schedule.day_of_week === dayOfWeek) {
                classes.push({
                  id: courseOffering.course_id,
                  name: enrollment.course_name,
                  time: `${schedule.start_time.substring(0, 5)} - ${schedule.end_time.substring(0, 5)}`,
                  location: schedule.room_number || courseOffering.location || "TBA",
                  instructor: courseOffering.professor_name || "TBA",
                })
              }
            }
          }
        }
      }

      setUpcomingClasses(classes)
    } catch (error) {
      console.error("Error fetching enrollments:", error)
      toast({
        title: "Error",
        description: "Failed to load enrollment data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncementsForStudent(session!.user.id)
      // Get only the most recent 2 announcements
      setAnnouncements(data.slice(0, 2))
    } catch (error) {
      console.error("Error fetching announcements:", error)
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive",
      })
    }
  }

  // Calculate registered credits
  const registeredCredits = enrollments
    .filter((e) => e.status === "enrolled")
    .reduce((sum, e) => sum + (e.credits || 0), 0)

  // Maximum credits (could be fetched from a settings table in the future)
  const maxCredits = 25

  const data = {
    student: {
      enrolledCourses: enrollments.length,
      upcomingAssignments: 3,
      announcements: announcements.length,
      nextClass: upcomingClasses.length > 0 ? upcomingClasses[0].name : "No upcoming class",
    },
    teacher: {
      teachingCourses: 2,
      totalStudents: 120,
      pendingAssignments: 5,
      announcements: 1,
    },
  }

  if (loading && !userData) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Loading dashboard...</h1>
        </div>
      </div>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Welcome back, {userRole === 'student' ? 'Student' : 'Professor'}
          </Heading>
          <Text color="gray.600">Here's what's happening with your courses</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {userRole === 'student' ? (
            <>
              <StatCard
                icon={FiBook}
                label="Enrolled Courses"
                value={data.student.enrolledCourses}
              />
              <StatCard
                icon={FiCalendar}
                label="Upcoming Assignments"
                value={data.student.upcomingAssignments}
              />
              <StatCard
                icon={FiBell}
                label="New Announcements"
                value={data.student.announcements}
              />
              <StatCard
                icon={FiCalendar}
                label="Next Class"
                value={data.student.nextClass}
                isTime
              />
            </>
          ) : (
            <>
              <StatCard
                icon={FiBook}
                label="Teaching Courses"
                value={data.teacher.teachingCourses}
              />
              <StatCard
                icon={FiUsers}
                label="Total Students"
                value={data.teacher.totalStudents}
              />
              <StatCard
                icon={FiCalendar}
                label="Pending Assignments"
                value={data.teacher.pendingAssignments}
              />
              <StatCard
                icon={FiBell}
                label="Announcements"
                value={data.teacher.announcements}
              />
            </>
          )}
        </SimpleGrid>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Recent Activity</Heading>
                <ActivityItem
                  title="Assignment Submitted"
                  description="Database Design Project"
                  time="2 hours ago"
                />
                <ActivityItem
                  title="New Announcement"
                  description="Mid-term exam schedule"
                  time="5 hours ago"
                />
                <ActivityItem
                  title="Course Material Updated"
                  description="Advanced SQL Queries"
                  time="1 day ago"
                />
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Upcoming Events</Heading>
                <EventItem
                  title="Database Systems"
                  time="10:00 AM"
                  date="Today"
                />
                <EventItem
                  title="Web Development"
                  time="2:00 PM"
                  date="Today"
                />
                <EventItem
                  title="Project Submission"
                  time="11:59 PM"
                  date="Tomorrow"
                />
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Container>
  )
}

interface StatCardProps {
  icon: any
  label: string
  value: string | number
  isTime?: boolean
}

function StatCard({ icon: Icon, label, value, isTime }: StatCardProps) {
  return (
    <Card>
      <CardBody>
        <Stat>
          <HStack spacing={4}>
            <Box
              p={2}
              bg="blue.100"
              color="blue.500"
              borderRadius="lg"
            >
              <Icon size={24} />
            </Box>
            <Box>
              <StatLabel>{label}</StatLabel>
              <StatNumber fontSize={isTime ? 'md' : '2xl'}>
                {value}
              </StatNumber>
              {!isTime && (
                <StatHelpText>
                  {typeof value === 'number' && value > 1 ? 'items' : 'item'}
                </StatHelpText>
              )}
            </Box>
          </HStack>
        </Stat>
      </CardBody>
    </Card>
  )
}

interface ActivityItemProps {
  title: string
  description: string
  time: string
}

function ActivityItem({ title, description, time }: ActivityItemProps) {
  return (
    <Box>
      <HStack justify="space-between">
        <Text fontWeight="bold">{title}</Text>
        <Text fontSize="sm" color="gray.500">
          {time}
        </Text>
      </HStack>
      <Text color="gray.600">{description}</Text>
    </Box>
  )
}

interface EventItemProps {
  title: string
  time: string
  date: string
}

function EventItem({ title, time, date }: EventItemProps) {
  return (
    <Box>
      <HStack justify="space-between">
        <Text fontWeight="bold">{title}</Text>
        <Badge colorScheme="blue">{date}</Badge>
      </HStack>
      <Text color="gray.600">{time}</Text>
    </Box>
  )
}

