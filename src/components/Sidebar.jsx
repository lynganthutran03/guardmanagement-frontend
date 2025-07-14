import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ user }) => {
    const [viewOpen, setViewOpen] = useState(false);

    const toggleView = () => {
        setViewOpen(!viewOpen);
    }

    return (
        <div className="sidebar">
            <h2>Vui Vẻ Hong Quạo</h2>
            <ul>
                <li><i className="fa-solid fa-chart-simple"></i>Trang Chủ</li>
                {user?.role?.toUpperCase() === 'GUARD' ? (
                    <>
                        <li><i className="fa-solid fa-calendar-plus"></i>Tạo Lịch Làm Việc</li>
                        <li><i className="fa-solid fa-envelope-open-text"></i>Yêu Cầu Nghỉ Phép</li>
                        <li onClick={toggleView} className="dropdown-parent">
                            <i className="fa-solid fa-bars"></i>Theo Dõi
                            <i className={`fa-solid fa-chevron-${viewOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                        </li>
                        {viewOpen && (
                            <ul className="dropdown-children">
                                <li><i className="fa-solid fa-clock"></i>Ca Trực Của Tôi</li>
                                <li><i className="fa-solid fa-calendar-xmark"></i>Buổi Nghỉ</li>
                            </ul>
                        )}
                    </>
                ) : (
                    <>
                        <li><i className="fa-solid fa-calendar-days"></i>Ca Trực Hôm Nay</li>
                        <li><i className="fa-solid fa-inbox"></i>Duyệt Nghỉ Phép</li>
                        <li><i className="fa-solid fa-user-pen"></i>Phân Công Ca Trực Bù</li>
                        <li onClick={toggleView} className="dropdown-parent">
                            <i className="fa-solid fa-folder-closed"></i>Theo Dõi
                            <i className={`fa-solid fa-chevron-${viewOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                        </li>
                        {viewOpen && (
                            <ul className="dropdown-children">
                                <li><i className="fa-solid fa-user-clock"></i>Thống Kê Buổi Vắng</li>
                                <li><i className="fa-solid fa-clock-rotate-left"></i>Lịch Sử Ca Trực</li>
                            </ul>
                        )}
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
