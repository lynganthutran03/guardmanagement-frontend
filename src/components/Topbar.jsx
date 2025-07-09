import React from 'react';
import './Topbar.css';

const Topbar = ({ user }) => {
    return (
        <div className="topbar">
            <i className="fa-solid fa-bell"></i>
            <img src="/images/avatar.jpg" alt="Avatar" className="avatar" />
            <span>{user.fullName}</span>
        </div>
    )
}

export default Topbar;
