import '../src/utilities/theme.js'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./views/home";
import Global from "./views/global";
import { createTheme, ThemeProvider } from '@mui/material';
import Auth from './views/auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Global/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
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
      <Auth>
        <RouterProvider router={router}/>
      </Auth>
    </ThemeProvider>
  )
}

export default App
