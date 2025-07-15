import React, { useState } from 'react';
import Login from './components/Login';
import AppLayout from './layout/AppLayout';
import ShiftGenerate from './pages/guard/ShiftGenerate';
import GuardHomePage from './pages/guard/GuardHomePage';
import { TitleProvider } from './context/TitleContext';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <TitleProvider>
      {!user ? (
        <Login onLoginSuccess={setUser} />
      ) : (
        <AppLayout user={user} onLogout={() => setUser(null) } setPage={setCurrentPage}>
          {user.role === 'GUARD' && currentPage === 'home' && <GuardHomePage user={user} />}
          {user.role === 'GUARD' && currentPage === 'shift' && <ShiftGenerate user={user} />}
          {/* You can add more guard pages like "absenceRequest" here */}

          {user.role === 'MANAGER' && currentPage === 'home' && <h2>Trang Chủ Quản Lý</h2>}
          {user.role === 'MANAGER' && currentPage === 'monitor' && <h2>Theo Dõi Ca Trực</h2>}
          {user.role === 'MANAGER' && currentPage === 'approval' && <h2>Duyệt Nghỉ Phép</h2>}
        </AppLayout>
      )}
    </TitleProvider>
  );
}

export default App;
