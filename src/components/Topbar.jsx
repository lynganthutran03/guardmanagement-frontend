import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Topbar.css';

const Topbar = ({ user, onLogout, title, notificationCount }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hovering, setHovering] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleQuickCheckIn = async () => {
        setIsCheckingIn(true);
        try {
            const res = await axios.post("/api/attendance/check-in");
            toast.success(res.data.message || "Điểm danh thành công!");
            setIsCheckedIn(true);
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi điểm danh.";
            if(message.includes("đã điểm danh")) {
                setIsCheckedIn(true);
                toast.info("Bạn đã điểm danh cho ca trực này rồi.");
            } else {
                toast.error(message);
            }
        } finally {
            setIsCheckingIn(false);
        }
    };

    const timeString = currentTime.toLocaleTimeString('vi-VN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

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
                {user.role === 'GUARD' && (
                    <div className="attendance-widget">
                        <span className="live-clock">{timeString}</span>
                        <button 
                            className={`quick-checkin-btn ${isCheckedIn ? 'checked-in' : ''}`}
                            onClick={handleQuickCheckIn}
                            disabled={isCheckingIn || isCheckedIn}
                            title={isCheckedIn ? "Bạn đã điểm danh hôm nay" : "Kết nối Wifi trường để điểm danh."}
                        >
                            {isCheckingIn ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i></>
                            ) : isCheckedIn ? (
                                <><i className="fa-solid fa-fingerprint"></i> Đã Điểm Danh</>
                            ) : (
                                <><i className="fa-solid fa-fingerprint"></i> Điểm Danh</>
                            )}
                        </button>
                    </div>
                )}

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
                <span className="user-name">{user.fullName}</span>
                <button className="logout-btn" onClick={handleLogout}>Đăng Xuất</button>
            </div>
        </div>
    );
};

export default Topbar;