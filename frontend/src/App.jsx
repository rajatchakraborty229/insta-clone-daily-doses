import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './components/SignUp';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/realTimeNotificationSlice';
import ProtectedRoutes from './components/ProtectedRoutes';


// Create Socket Context
const SocketContext = createContext(null);

// Custom Hook to use the Socket
export const useSocket = () => useContext(SocketContext);

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <ProtectedRoutes><Home /> </ProtectedRoutes> },
      { path: '/profile/:id', element:<ProtectedRoutes><Profile /></ProtectedRoutes>  },
      { path: '/account/edit', element:<ProtectedRoutes><EditProfile /></ProtectedRoutes>  },
      { path: '/chat', element:<ProtectedRoutes><ChatPage /></ProtectedRoutes>  },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const likeNotificationSound=new Audio('/sounds/notification-alert.mp3')

  useEffect(() => {
    if (user) {
      const newSocket = io('https://insta-clone-daily-doses.onrender.com', {
        query: { userId: user?._id },
        transports: ['websocket'],
      });

      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      newSocket.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification))
        likeNotificationSound.play()
      })

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      <RouterProvider router={browserRouter} />
    </SocketContext.Provider>
  );
}

export default App;
