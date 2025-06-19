import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { axiosInstance } from './lib/axios.js';
import { useQuery } from '@tanstack/react-query';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';

const App = () => {
  // axios
  // tansack query crash course


  const { data:authData, isLoading } = useAuthUser();
  const authUser = authData?.user;

  if(isLoading) return <PageLoader/>

  const isAuthenticated = Boolean(authUser);
  const isOnboarderd = authUser?.isOnboarderd;

  return (
    <div className='h-screen' data-theme="night">

      <Routes>
        
        <Route path="/" element={ isAuthenticated && isOnboarderd ? (
          <HomePage/>
          ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
          ) } />

        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={ isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" /> } />
        <Route path="/call" element={ isAuthenticated ? <CallPage /> : <Navigate to="/login" /> } />
        <Route path="/chat" element={ isAuthenticated ? <ChatPage /> : <Navigate to="/login" /> } />
        <Route path="/onboarding" element={ isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" /> } />

      </Routes>

      <Toaster />
    </div>
  )
}

export default App
