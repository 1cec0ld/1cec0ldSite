import { Button, TextField, Box } from "@mui/material"
import { useAuth } from "../auth/Auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



export default function Login() {
  const {loginAction, token} = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    if (token) navigate('/')
  })

  return (
    <form>
      <Box><TextField id="username" size='small' label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)}/></Box>
      <Box><TextField id="password" size='small' label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/></Box>
      <Button size='large' variant='contained' onClick={() => loginAction()}>Login</Button>
    </form>
  )
}