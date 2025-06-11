import React from 'react'
import { useRouter } from "next/navigation";
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'
import BrushIcon from '@mui/icons-material/Brush'
import EventIcon from '@mui/icons-material/Event'
import InfoIcon from '@mui/icons-material/Info'
import SettingsIcon from '@mui/icons-material/Settings'
import SecurityIcon from '@mui/icons-material/Security'


export enum UserRole {
  ADMIN = "ROLE_ADMIN",
  GALLERY_MANAGER = "ROLE_GALLERY_MANAGER",
  ARTIST = "ROLE_ARTIST",
  USER = "ROLE_USER",
}

export type NavigationItem = {
  label: string
  icon: React.ReactNode
  path: string
  roles?: UserRole[]
}

const navigationItems: NavigationItem[] = [
  // 1. User
  {
    label: 'Discover Art & Events',
    icon: <PersonIcon />,
    path: '/browse',
    roles: [UserRole.USER],
  },
  {
    label: 'My Profile',
    icon: <BrushIcon />,
    path: '/account/profile',
    roles: [UserRole.USER],
  },

  // 2. Artist
  {
    label: 'My Profile',
    icon: <BrushIcon />,
    path: '/account/profile',
    roles: [UserRole.ARTIST],
  },
  {
    label: 'My Dashboard',
    icon: <BrushIcon />,
    path: '/dashboard',
    roles: [UserRole.ARTIST],
  },
  {
    label: 'My Artwork',
    icon: <BrushIcon />,
    path: '/artworks',
    roles: [UserRole.ARTIST],
  },
  

  // 3. Gallery Manager
  {
    label: 'My Profile',
    icon: <BrushIcon />,
    path: '/account/profile',
    roles: [UserRole.GALLERY_MANAGER],
  },
  {
    label: 'My Dashboard',
    icon: <BrushIcon />,
    path: '/dashboard',
    roles: [UserRole.GALLERY_MANAGER],
  },
  {
    label: 'Artist Management',
    icon: <PersonIcon />,
    path: '/artists',
    roles: [UserRole.GALLERY_MANAGER],
  },
  {
    label: 'My Artwork',
    icon: <BrushIcon />,
    path: '/artworks',
    roles: [UserRole.GALLERY_MANAGER],
  },
  {
    label: 'Gallery Management',
    icon: <InfoIcon />,
    path: '/galleries',
    roles: [UserRole.GALLERY_MANAGER],
  },
  
]

interface RoleBasedNavProps {
  userRole?: UserRole
}

const RoleBasedNav: React.FC<RoleBasedNavProps> = ({ userRole }) => {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <List sx={{ px: 1 }}>
      {navigationItems.map((item) => {
        // Only show if there's no roles restriction OR if userRole is in the list
        if (item.roles && (!userRole || !item.roles.includes(userRole))) {
          return null
        }

        return (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                '&:hover': { backgroundColor: 'primary.lighter' },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}

export default RoleBasedNav