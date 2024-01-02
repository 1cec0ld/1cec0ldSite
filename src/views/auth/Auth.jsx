import { createContext, useContext, useState } from "react";
import axiosInstance from "../../utilities/axios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')

  const loginAction = async (data) => {
    axiosInstance
      .post(`api/v1/u/login`, data)
      .then((response) => {
        if (response.data.token) {
          setToken(response.data.token)
          setUser(response.data.user)
          return;
        }
        throw new Error('API connected, no token received')
      })
      .catch((error) => {
        console.log('error logging in', error)
        setUser(error)
      })
  }

  const logOut = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('site')
  }

  return (
    <AuthContext.Provider value={{token, user, loginAction, logOut}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => useContext(AuthContext)