import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { useUser } from './context/UserContext';
import Login from './pages/Login';
import Signup from './pages/Signup';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-6">
      <div className="glass-card w-full max-w-md rounded-[28px] p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-gradient-to-r from-brand-teal to-brand-violet" />
        <p className="text-sm uppercase tracking-[0.3em] text-brand-muted">Loading SkillSpring</p>
        <h1 className="mt-4 font-display text-3xl text-white">Preparing your growth cockpit.</h1>
      </div>
    </div>
  );
}

function PublicRoute({ children }) {
  const { user } = useUser();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
}
