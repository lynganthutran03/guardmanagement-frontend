import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
    const [viewOpen, setViewOpen] = useState(false);

    const toggleView = () => {
        setViewOpen(!viewOpen);
    }

    return (
        <div className="sidebar">
            <h2>Guard App</h2>
            <ul>
                <li><i className="fa-solid fa-chart-simple"></i>Dashboard</li>
                <li><i className="fa-solid fa-calendar-plus"></i>Shift Generate</li>
                <li><i className="fa-solid fa-envelope-open-text"></i>Request Absence</li>
                <li onClick={toggleView} className="dropdown-parent">
                    <i className="fa-solid fa-bars"></i>View
                    <i className={`fa-solid fa-chevron-${viewOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                </li>
                {viewOpen && (
                    <ul className="dropdown-children">
                        <li><i className="fa-solid fa-clock"></i>My Shift</li>
                        <li><i className="fa-solid fa-calendar-xmark"></i>Absence</li>
                    </ul>
                )}  
            </ul>
        </div>
    );
};

export default Sidebar;
