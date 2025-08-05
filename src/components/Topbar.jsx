import React, { useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import './Topbar.css';

const Topbar = ({ user, onLogout }) => {
    const { title } = useContext(TitleContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [hovering, setHovering] = useState(false);

    const handleLogout = () => {
        onLogout();
    };

    const handleBellClick = () => {
        setShowDropdown(true);
    };

    const handleMouseEnter = () => {
        setHovering(true);
    };

    const handleMouseLeave = () => {
        setHovering(false);
        setShowDropdown(false);
    };

    return (
        <div className="topbar">
            <div className="topbar-left">
                <h2>{title}</h2>
            </div>
            <div className="topbar-right">
                <div
                    className="notif-wrapper"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <i
                        className="fa-solid fa-bell notif-icon"
                        onClick={handleBellClick}
                    ></i>

                    {showDropdown && hovering && (
                        <div className="notif-dropdown">
                            <div className="notif-item">
                                <i className="fa-solid fa-calendar-check notif-icon-line"></i>
                                <span>Bạn có lịch làm mới, vui lòng vào <strong>Ca Trực Hôm Nay</strong> để biết rõ hơn.</span>
                            </div>
                            <div className="notif-item">
                                <i className="fa-solid fa-envelope-open-text notif-icon-line"></i>
                                <span>Đơn xin nghỉ của bạn đã có phản hồi. Vui lòng đến <strong>Theo Dõi → Buổi Nghỉ</strong> để xem.</span>
                            </div>
                        </div>
                    )}
                </div>
                <img src="/images/avatar.jpg" alt="Avatar" className="avatar" />
                <span>{user.fullName}</span>
                <button className="logout-btn" onClick={handleLogout}>Đăng Xuất</button>
            </div>
        </div>
    );
};

export default Topbar;
