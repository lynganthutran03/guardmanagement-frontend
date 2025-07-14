import React, { useState } from 'react';
import Login from './components/Login';
import AppLayout from './layout/AppLayout';
import ShiftGenerate from './pages/ShiftGenerate';
import { TitleProvider } from './context/TitleContext';

function App() {
  const [user, setUser] = useState(null);

  return (
    <TitleProvider>
      {!user ? (
        <Login onLoginSuccess={setUser} />
      ) : (
        <AppLayout user={user} onLogout={() => setUser(null)}>
          <ShiftGenerate />
        </AppLayout>
      )}
    </TitleProvider>
  );
}

export default App;
