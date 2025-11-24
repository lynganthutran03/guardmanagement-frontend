import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ user, setPage }) => {
    const [viewOpen, setViewOpen] = useState(false);

    const toggleView = () => {
        setViewOpen(!viewOpen);
    }

    const renderNavLinks = () => {
        if (user?.role?.toUpperCase() === 'GUARD') {
            return (
                <>
                    <li onClick={() => setPage('guard-home')}>
                        <i className="fa-solid fa-chart-simple"></i>Trang Chủ
                    </li>
                    <li onClick={() => setPage('today-shift')}>
                        <i className="fa-solid fa-calendar-days"></i>Ca Trực Hôm Nay
                    </li>
                    <li onClick={() => setPage('request')}>
                        <i className="fa-solid fa-envelope-open-text"></i>Yêu Cầu Nghỉ Phép
                    </li>
                    <li onClick={toggleView} className="dropdown-parent">
                        <i className="fa-solid fa-bars"></i>Theo Dõi
                        <i className={`fa-solid fa-chevron-${viewOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                    </li>
                    {viewOpen && (
                        <ul className="dropdown-children">
                            <li onClick={() => setPage('my-shifts')}>
                                <i className="fa-solid fa-clock"></i>Lịch Sử Ca Trực
                            </li>
                            <li onClick={() => setPage('absence')}>
                                <i className="fa-solid fa-calendar-xmark"></i>Danh Sách Nghỉ Phép
                            </li>
                            <li onClick={() => setPage('payroll')}>
                                <i className="fa-solid fa-money-bill-wave"></i>Xem Lương
                            </li>
                        </ul>
                    )}
                </>
            );
        }

        if (user?.role?.toUpperCase() === 'MANAGER') {
            return (
                <>
                    <li onClick={() => setPage('manager-home')}>
                        <i className="fa-solid fa-chart-simple"></i>Trang Chủ
                    </li>
                    <li onClick={() => setPage('generate-shift')}>
                        <i className="fa-solid fa-calendar-plus"></i>Tạo Lịch Làm Việc
                    </li>
                    <li onClick={() => setPage('approval')}>
                        <i className="fa-solid fa-inbox"></i>Duyệt Nghỉ Phép
                    </li>
                    <li onClick={() => setPage('rearrange')}>
                        <i className="fa-solid fa-user-pen"></i>Phân Công Ca Trực Bù
                    </li>
                    <li onClick={() => setPage('payroll')}>
                        <i className="fa-solid fa-file-invoice-dollar"></i>Bảng Lương
                    </li>
                    <li onClick={toggleView} className="dropdown-parent">
                        <i className="fa-solid fa-folder-closed"></i>Theo Dõi
                        <i className={`fa-solid fa-chevron-${viewOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                    </li>
                    {viewOpen && (
                        <ul className="dropdown-children">
                            <li onClick={() => setPage('absence-history')}>
                                <i className="fa-solid fa-user-clock"></i>Thống Kê Buổi Vắng
                            </li>
                            <li onClick={() => setPage('shift-history')}>
                                <i className="fa-solid fa-clock-rotate-left"></i>Lịch Sử Ca Trực
                            </li>
                        </ul>
                    )}
                </>
            );
        }

        if (user?.role?.toUpperCase() === 'ADMIN') {
            return (
                <>
                    <li onClick={() => setPage('admin-guards')}>
                        <i className="fa-solid fa-users-cog"></i>Bảo Vệ
                    </li>
                    <li onClick={() => setPage('admin-managers')}>
                        <i className="fa-solid fa-user-tie"></i>Quản Lý
                    </li>
                    <li onClick={() => setPage('admin-locations')}>
                        <i className="fa-solid fa-map-location-dot"></i>Khu Vực
                    </li>
                    <li onClick={() => setPage('admin-timeslots')}>
                        <i className="fa-solid fa-hourglass-half"></i>Ca Trực
                    </li>
                </>
            );
        }

        return null;
    };

    return (
        <div className="sidebar">
            <h2>EIU - Vigilant</h2>
            <ul>
                {renderNavLinks()}
            </ul>
        </div>
    );
};

export default Sidebar;