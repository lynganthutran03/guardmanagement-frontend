import React, { useState, useContext, useEffect } from 'react';
import { TitleContext } from '../../context/TitleContext';
import './LeaveRequestCheck.css';

const mockRequests = [
    { id: 1, date: '2025-07-29', days: 2, reason: 'Ốm' },
    { id: 2, date: '2025-07-30', days: 1, reason: 'Gia đình có việc' },
    { id: 3, date: '2025-07-25', days: 3, reason: 'Về quê' },
    { id: 4, date: '2025-08-01', days: 1, reason: 'Khám bệnh' },
    { id: 5, date: '2025-08-02', days: 2, reason: 'Lý do cá nhân' },
    { id: 6, date: '2025-08-05', days: 1, reason: 'Đi đám cưới' }
];

const LeaveRequestGrid = () => {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        setTitle('Duyệt Nghỉ Phép');
    }, [setTitle]);

    return (
        <div className="leave-grid-container">
            {mockRequests.map(req => (
                <div key={req.id} className="leave-card">
                    <p><strong>Ngày yêu cầu:</strong> {req.date}</p>
                    <p><strong>Số ngày nghỉ:</strong> {req.days}</p>
                    <p><strong>Lý do:</strong> {req.reason}</p>
                    <div className="button-group">
                        <button className="accept">Đồng ý</button>
                        <button className="reject">Không đồng ý</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LeaveRequestGrid;
