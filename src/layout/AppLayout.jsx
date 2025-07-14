import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './AppLayout.css';

const AppLayout = ({ user, title, onLogout, children }) => {
    return (
        <div className="app-layout">
            <Sidebar user={user} />
            <div className="main-area">
                <Topbar user={user} onLogout={onLogout} title={title} />
                <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default AppLayout;
