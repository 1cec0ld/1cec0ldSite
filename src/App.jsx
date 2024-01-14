import '../src/utilities/theme.js'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./views/home";
import Global from "./views/global";
import Admin from "./views/admin";
import { createTheme, ThemeProvider } from '@mui/material';
import AuthProvider from './views/auth';
import Login from './views/login/';
import Momentum from './views/games/momentum/';
import Momentum2 from './views/games/momentum2/index.jsx';

const router = createBrowserRouter([
  {
    path: "",
    element: <Global/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "admin",
        element: <Admin/>
      },
      {
        path: "momentum",
        element: <Momentum />
      },
      {
        path: 'momentum2',
        element: <Momentum2 />
      }
    ]
  }
])



const theme = createTheme({
  palette: {
    mode: document.color || 'dark',
  },
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
