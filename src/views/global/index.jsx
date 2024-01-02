import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { ChevronLeft, ChevronRight, Lock, LockOpen } from '@mui/icons-material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../public/fractalice.gif'
import { Avatar, Button, CardHeader} from '@mui/material';
import SideList from './SideList';
import { useAuth } from '../auth/Auth';

const drawerWidth = 240;

const DrawerHeader = styled('div', {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'space-between' : 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { token, loginAction, logOut } = useAuth()
  const navigate = useNavigate()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // MaterialUI button to log in or log out
  const LogButton = ({isAuthenticated}) => {
    return (
      <Button
        size='large' 
        variant='contained' 
        onClick={() => {
          isAuthenticated ? logOut() : navigate('/login')
        }}
        startIcon={isAuthenticated ? null : <LockOpen/>}
        endIcon={isAuthenticated ? <Lock/> : null}
      >
        {isAuthenticated ? 'Log out' : 'Log in'}
      </Button>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <CardHeader sx={{marginLeft: !open ? `calc(${theme.spacing(7)} + 1px)` : ''}}
            avatar={<Avatar component='span' alt="1ce" src={logo}/>}
            title={<Typography variant="h6" noWrap component="span">
              <Link to="/">{window.location.hostname}</Link>
            </Typography>}
          />
          <LogButton isAuthenticated={token.length > 0}/>

        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader open={open}>
          {open &&
            <>
              <Typography variant="h6" noWrap component="span">
                Links
              </Typography>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeft />
              </IconButton>
            </>
          }
          {!open &&
            <IconButton onClick={handleDrawerOpen}>
              <ChevronRight />
            </IconButton>
          }
        </DrawerHeader>
        <Divider />
        <SideList/>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet/>
      </Box>
    </Box>
  );
}
