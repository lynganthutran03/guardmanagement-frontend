import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AppLayout.css';

const AppLayout = ({ user, title, setPage, onLogout, children, notificationCount }) => {
    return (
        <div className="app-layout">
            <Sidebar user={user} setPage={setPage} />
            <div className="main-area">
                <Topbar
                    user={user}
                    onLogout={onLogout}
                    title={title}
                    notificationCount={notificationCount}
                />
                <div className="content">{children}</div>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default AppLayout;