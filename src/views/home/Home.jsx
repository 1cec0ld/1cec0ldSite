import { Box, Typography } from "@mui/material"
import { useAuth } from "../auth/Auth"



const KnownUserMessage = (user) => {
  return (
    <Box>
      <Typography variant="h2">Welcome {user.name}!</Typography>
      <Typography variant="h3">Use the links on the left to navigate.</Typography>
    </Box>
  )
}



const UnknownUserMessage = () => {
  return (
    <Box>
      <Typography variant="h2">Welcome!</Typography>
      <Typography variant="h4">Please login to continue, or use the public links.</Typography>
    </Box>
  )
}



const Home = () => {
  const { token, user } = useAuth()
  
  return (
    <>
      {token ? KnownUserMessage(user) : UnknownUserMessage()}
    </>
  )
}

export default Home