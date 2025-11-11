import React, { useState } from 'react';
import './Topbar.css';

const Topbar = ({ user, onLogout, title, notificationCount }) => {
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
                {user.role !== 'ADMIN' && (
                    <div
                        className="notif-wrapper"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <i
                            className="fa-solid fa-bell notif-icon"
                            onClick={handleBellClick}
                        ></i>

                        {user.role === 'MANAGER' && notificationCount > 0 && (
                            <span className="notif-badge">{notificationCount}</span>
                        )}

                        {showDropdown && hovering && (
                            <div className="notif-dropdown">
                                {user.role === 'GUARD' && (
                                    <>
                                        <div className="notif-item">
                                            <i className="fa-solid fa-calendar-check notif-icon-line"></i>
                                            <span>Bạn có lịch làm mới, vui lòng vào <strong>Ca Trực Hôm Nay</strong>.</span>
                                        </div>
                                        <div className="notif-item">
                                            <i className="fa-solid fa-envelope-open-text notif-icon-line"></i>
                                            <span>Đơn xin nghỉ đã có phản hồi. Vui lòng đến <strong>Danh Sách Nghỉ Phép</strong>.</span>
                                        </div>
                                    </>
                                )}
                                {user.role === 'MANAGER' && (
                                    <>
                                        {notificationCount > 0 ? (
                                            <div className="notif-item">
                                                <i className="fa-solid fa-inbox notif-icon-line"></i>
                                                <span>Bạn có <strong>{notificationCount} đơn nghỉ phép</strong> mới đang chờ duyệt.</span>
                                            </div>
                                        ) : (
                                            <div className="notif-item">
                                                <span>Không có thông báo mới.</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <img src="/images/avatar.jpg" alt="Avatar" className="avatar" />
                <span>{user.fullName}</span>
                <button className="logout-btn" onClick={handleLogout}>Đăng Xuất</button>
            </div>
        </div>
    );
};

export default Topbar;