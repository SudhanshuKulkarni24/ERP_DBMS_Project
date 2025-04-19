"use client"

import { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  CloseButton,
} from '@chakra-ui/react'
import {
  FiHome,
  FiBook,
  FiCalendar,
  FiBell,
  FiMenu,
  FiUsers,
  FiSettings,
} from 'react-icons/fi'
import Link from 'next/link'

interface NavItemProps {
  icon: any
  children: React.ReactNode
  href: string
}

const NavItem = ({ icon, children, href }: NavItemProps) => {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'blue.400',
          color: 'white',
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
        />
        {children}
      </Flex>
    </Link>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMobile, setIsMobile] = useState(false)

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  )
}

interface SidebarProps {
  onClose: () => void
  display?: any
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          CMS
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <VStack spacing={4} align="stretch">
        <NavItem icon={FiHome} href="/dashboard">
          Dashboard
        </NavItem>
        <NavItem icon={FiBook} href="/dashboard/courses">
          Courses
        </NavItem>
        <NavItem icon={FiCalendar} href="/dashboard/timetable">
          Timetable
        </NavItem>
        <NavItem icon={FiBell} href="/dashboard/announcements">
          Announcements
        </NavItem>
        <NavItem icon={FiUsers} href="/dashboard/students">
          Students
        </NavItem>
        <NavItem icon={FiSettings} href="/dashboard/settings">
          Settings
        </NavItem>
      </VStack>
    </Box>
  )
}

interface MobileNavProps {
  onOpen: () => void
}

const MobileNav = ({ onOpen }: MobileNavProps) => {
  return (
    <Flex
      ml="4"
      mr="4"
      mt="4"
      alignItems="center"
      justifyContent="space-between"
      display={{ base: 'flex', md: 'none' }}
    >
      <Icon
        as={FiMenu}
        w={5}
        h={5}
        onClick={onOpen}
        cursor="pointer"
      />
      <Text fontSize="2xl" fontWeight="bold">
        CMS
      </Text>
    </Flex>
  )
}

