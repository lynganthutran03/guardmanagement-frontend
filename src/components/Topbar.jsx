import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Topbar.css';
import { parseISO, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const Topbar = ({ user, onLogout, title, notificationCount: managerPendingCount }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hovering, setHovering] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUneadCount] = useState(0);
    const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    useEffect(() => {
        if (user.role !== 'ADMIN') {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user.role]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/api/notifications/mine");
            const notifs = res.data || [];
            setNotifications(notifs);

            const unread = notifs.filter(n => !n.read).length;
            setUneadCount(unread);
        } catch (err) {
            console.error("Lỗi tải thông báo: ", err);
        }
    };

    const handleBellClick = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            fetchNotifications();
        }
    };

    const handleMouseEnter = () => { setHovering(true); };

    const handleMouseLeave = () => {
        setHovering(false);
        setShowDropdown(false);
    };

    const handleMarkRead = async (notifId) => {
        try {
            await axios.post(`/api/notifications/mark-read/${notifId}`);
            const updatedNotifs = notifications.map(n =>
                n.id === notifId ? { ...n, read: true } : n
            );
            setNotifications(updatedNotifs);
            setUneadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Lỗi đánh dấu đã đọc: ", err);
        }
    };

    const handleQuickCheckIn = async () => {
        setIsCheckingIn(true);
        try {
            const res = await axios.post("/api/attendance/check-in");
            
            toast.success(res.data.message);
            setIsCheckedIn(true);
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi.";
            if (message.includes("đã điểm danh")) {
                setIsCheckedIn(true);
                toast.info("Bạn đã điểm danh rồi.");
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

    const totalBadgeCount = (user.role === 'MANAGER' ? managerPendingCount : 0) + unreadCount;

    const handleLogout = () => { onLogout(); };

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
                        >
                            {isCheckingIn ? <i className="fa-solid fa-spinner fa-spin"></i> :
                                isCheckedIn ? <><i className="fa-solid fa-check-circle"></i> Đã Điểm Danh</> :
                                    <><i className="fa-solid fa-fingerprint"></i> Điểm Danh</>}
                        </button>
                    </div>
                )}

                {user.role !== 'ADMIN' && (
                    <div className="notif-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <i className="fa-solid fa-bell notif-icon" onClick={handleBellClick}></i>
                        {totalBadgeCount > 0 && (
                            <span className="notif-badge">{totalBadgeCount}</span>
                        )}

                        {showDropdown && hovering && (
                            <div className="notif-dropdown">
                                <div className="notif-header">Thông báo</div>
                                <div className="notif-list">
                                    {isLoadingNotifs ? (
                                        <div className="notif-item loading">Đang tải...</div>
                                    ) : notifications.length > 0 ? (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                                                onClick={() => handleMarkRead(notif.id)}
                                            >
                                                <div className="notif-icon-box">
                                                    <i className="fa-solid fa-info-circle"></i>
                                                </div>
                                                <div className="notif-content">
                                                    <p>{notif.message}</p>
                                                    <span className="notif-time">
                                                        {formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true, locale: vi })}
                                                    </span>
                                                </div>
                                                {!notif.read && <div className="unread-dot"></div>}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="notif-item empty">Không có thông báo nào.</div>
                                    )}
                                </div>
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