import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import Sales from '../pages/Sales';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UserManagement from '../pages/UserManagement';
import HomePage from '../pages/Home/HomePage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicRoute from '../components/common/PublicRoute';

const router = createBrowserRouter([
  // Public Landing Page (Accessible by all, auto-redirects to /dashboard if logged in)
  {
    path: '/',
    element: <HomePage />,
  },
  // Public Auth Routes (Accessible only when NOT logged in)
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  // Protected Routes (Accessible by authenticated users)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'inventory',
            element: <Inventory />,
          },
          {
            path: 'sales',
            element: <Sales />,
          },
          {
            path: 'analytics',
            element: <Analytics />,
          },
        ],
      },
    ],
  },
  // Admin-Only Protected Routes
  {
    element: <ProtectedRoute requireAdmin={true} />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: 'users',
            element: <UserManagement />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
    ],
  },
  // Fallback route
  {
    path: '*',
    element: <HomePage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
