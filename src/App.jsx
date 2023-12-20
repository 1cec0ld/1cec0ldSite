import '../src/utilities/theme.js'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./views/home";
import Global from "./views/global";
import { createTheme, ThemeProvider } from '@mui/material';

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
],
{ basename: document.location.hostname === 'localhost' ? '' : '/1cec0ld'})

const theme = createTheme({
  palette: {
    mode: document.color || 'dark',
  },
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  )
}

export default App
