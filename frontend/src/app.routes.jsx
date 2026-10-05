import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Protected from './features/auth/components/Protected'
import Home from './features/interview/pages/Home'




export const router = createBrowserRouter([

    //  {
    //     path: '*',
    //     element: <Navigate to="/login"/>,
    // },
   
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: '/register',
        element: <Register/>
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    }, {
        path: '/home',
        element: 
        <Protected>
             <Home/>
        </Protected>
    }
])
