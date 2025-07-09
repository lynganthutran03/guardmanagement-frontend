import React, { useState } from 'react';
import Login from './components/Login';
import AppLayout from './layout/AppLayout';
import ShiftGenerate from './pages/ShiftGenerate';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {!user ? (
        <Login onLoginSuccess={setUser} />
      ) : (
        <AppLayout user={user}>
          <ShiftGenerate />
        </AppLayout>
      )}
    </>
  );
}

export default App;
