import React from 'react';
import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './GuardHomePage.css';

const GuardHomePage = ({ user }) => {
    const { setTitle } = useContext(TitleContext);
    const [acceptedShift, setAcceptedShift] = useState([]);

    useEffect(() => {
        setTitle('Trang Chủ Bảo Vệ');
        axios.get("http://localhost:8080/api/shifts/accepted-today", {
            withCredentials: true
        })
            .then(res => setAcceptedShift(res.data))
            .catch(() => setAcceptedShift([]));
    }, [setTitle]);

    return (
        <div className="guard-home-page">
            <h3>Xin chào, {user.fullName}!</h3>
            <p><strong>Mã nhân viên:</strong> {user.identityNumber}</p>
            <div className="shift-box">
                <h4>Ca trực của bạn hôm nay:</h4>
                {acceptedShift.length > 0 ? (
                    <ul>
                        {acceptedShift.map(shift => (
                            <div className="shift-info" key={shift.id}>
                                <p><strong>Ngày:</strong> {shift.shiftDate}</p>
                                <p><strong>Ca trực:</strong> {shift.timeSlot}</p>
                                <p><strong>Khu vực:</strong> {shift.block}</p>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p>Bạn chưa có ca trực nào được chấp nhận hôm nay.</p>
                )}
            </div>
        </div>
    );
};

export default GuardHomePage;