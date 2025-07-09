import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './AppLayout.css';

const AppLayout = ({ user, children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-area">
                <Topbar user={user} />
                <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default AppLayout;
