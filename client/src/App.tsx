import React from 'react';
import AppProviders from './providers/AppProviders';
import AppRouter from './routes';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;
