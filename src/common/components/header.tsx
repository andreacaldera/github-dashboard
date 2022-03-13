// import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'

import MenuItem from '@mui/material/MenuItem'
import styled from '@emotion/styled'
import { StyleButton } from './button'

const MenuButton = styled(StyleButton)`
  margin-left: 1rem !important;
`

const pages = ['Action Dashboard', 'Lighthouse Report']

export const Header = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            Github Dashboard
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <MenuButton
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ ml: 2, color: 'white', display: 'block' }}
              >
                {page}
              </MenuButton>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {!session && (
              <>
                <a
                  href={`/api/auth/signin`}
                  onClick={(e) => {
                    e.preventDefault()
                    signIn()
                  }}
                >
                  Login
                </a>
              </>
            )}
            {session?.user && (
              <>
                {session.user.image && (
                  <span
                    style={{ backgroundImage: `url('${session.user.image}')` }}
                  />
                )}
                <span>
                  <small>Welcome back </small>
                  <strong>{session.user.email ?? session.user.name}</strong>
                </span>
                <MenuButton
                  href={`/api/auth/signout`}
                  onClick={(e) => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  Logout
                </MenuButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
