import { Button } from "@mui/base"
import { Box } from "@mui/material"


const Home = () => {
  return (
    <Box>
      <Button onClick={() => alert("eh?")} className="logo">click me </Button>
    </Box>
  )
}

export default Home