import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './AppLayout.css';

const AppLayout = ({ user, title, setPage, onLogout, children }) => {
    return (
        <div className="app-layout">
            <Sidebar user={user} setPage={setPage} />
            <div className="main-area">
                <Topbar user={user} onLogout={onLogout} title={title} />
                <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default AppLayout;
