import React, { useState } from 'react';
import Login from './components/Login';
import { TitleProvider } from './context/TitleContext';
import AppLayout from './layout/AppLayout';

import GuardHomePage from './pages/guard/GuardHomePage';
import TodayShift from './pages/guard/TodayShift';
import AbsenceRequestForm from './pages/guard/AbsenceRequestForm';
import MyShifts from './pages/guard/MyShifts';
import ListOfAbsence from './pages/guard/ListOfAbsence';

import ShiftGenerate from './pages/manager/ShiftGenerate';
import LeaveRequestCheck from './pages/manager/LeaveRequestCheck';
import ShiftReassign from './pages/manager/ShiftReassign';
import ManagerHomePage from './pages/manager/ManagerHomePage';
import AbsenceStats from './pages/manager/AbsenceStats';
import ShiftHistory from './pages/manager/ShiftHistory';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('');

  const handleLoginSuccess = (userData) => {
    setUser(userData);

    if (userData.role === 'GUARD') {
      setCurrentPage('guard-home');
    } else if (userData.role === 'MANAGER') {
      setCurrentPage('manager-home');
    }
  }
  return (
    <TitleProvider>
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AppLayout user={user} onLogout={() => setUser(null)} setPage={setCurrentPage}>
          {user.role === 'GUARD' && currentPage === 'guard-home' && <GuardHomePage user={user} />}
          {user.role === 'GUARD' && currentPage === 'today-shift' && <TodayShift user={user} />}
          {user.role === 'GUARD' && currentPage === 'request' && <AbsenceRequestForm user={user} />}
          {user.role === 'GUARD' && currentPage === 'my-shifts' && <MyShifts user={user} />}
          {user.role === 'GUARD' && currentPage === 'absence' && <ListOfAbsence user={user} />}

          {user.role === 'MANAGER' && currentPage === 'manager-home' && <ManagerHomePage user={user} />}
          {user.role === 'MANAGER' && currentPage === 'generate-shift' && <ShiftGenerate user={user} />}
          {user.role === 'MANAGER' && currentPage === 'approval' && <LeaveRequestCheck user={user} />}
          {user.role === 'MANAGER' && currentPage === 'rearrange' && <ShiftReassign user={user} />}
          {user.role === 'MANAGER' && currentPage === 'absence-history' && <AbsenceStats user={user}/>}
          {user.role === 'MANAGER' && currentPage === 'shift-history' && <ShiftHistory user={user} />}
        </AppLayout>
      )}
    </TitleProvider>
  );
}

export default App;
