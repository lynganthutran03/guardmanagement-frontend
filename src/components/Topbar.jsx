import React from 'react';
import { useContext } from 'react';
import { TitleContext } from '../context/TitleContext';
import './Topbar.css';

const Topbar = ({ user, onLogout }) => {
    const { title } = useContext(TitleContext);

    const handleLogout = () => {
        onLogout();
    };

    return (
        <div className="topbar">
            <div className="topbar-left">
            <h2>{title}</h2>
            </div>
            <div className="topbar-right">
                <i className="fa-solid fa-bell notif-icon"></i>
                <img src="/images/avatar.jpg" alt="Avatar" className="avatar" />
                <span>{user.fullName}</span>
                <button className="logout-btn" onClick={handleLogout}>Đăng Xuất</button>
            </div>
        </div>
    )
}

export default Topbar;
