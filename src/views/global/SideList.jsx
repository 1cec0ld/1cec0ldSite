import { AdminPanelSettings, SportsEsports } from "@mui/icons-material";
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";




export default function SideList()  {
  const [gamesCollapse, setGamesCollapse] = useState(false)
  const navigate = useNavigate()

  return (
    <List>
      <ListItem key="l" disablePadding sx={{display: 'block'}}>
        <ListItemButton sx={{minHeight: 48, justifyContent:  'initial', px: 2.5}}>
          <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
            <AdminPanelSettings />
          </ListItemIcon>
          <Typography sx={{pl: 1}} variant="body1" noWrap component="span">
            ...
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListItem key="hj" disablePadding sx={{display: 'block'}}>
        <ListItemButton sx={{minHeight: 48, justifyContent:  'initial', px: 2.5}} onClick={() => setGamesCollapse(!gamesCollapse)}>
          <ListItemIcon sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
            <SportsEsports />
          </ListItemIcon>
          <Typography sx={{pl: 1}} variant="body1" noWrap component="span">
            Games
          </Typography>
        </ListItemButton>
      </ListItem>
      <Collapse in={gamesCollapse} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem key="s" disablePadding sx={{display: 'block', pl: 6}}>
            <ListItemButton onClick={() => navigate('/momentum')}>
              <Typography sx={{pl: 1.5}} variant="body1" noWrap component="span">
                Momentum
              </Typography>
            </ListItemButton>
          </ListItem>
          <ListItem key="hjf" disablePadding sx={{display: 'block', pl: 6}}>
            <ListItemButton>
              <Typography sx={{pl: 1.5}} variant="body1" noWrap component="span">
                Gravity
              </Typography>
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>
    </List>
  )
}