import React from 'react';
import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './GuardHomePage.css';

const GuardHomePage = ({ user }) => {
    const { setTitle } = useContext(TitleContext);
    const [acceptedShift, setAcceptedShift] = useState(null);

    useEffect(() => {
        setTitle('Trang Chủ Bảo Vệ');
        axios.get("http://localhost:8080/api/shifts/accepted-today", {
            withCredentials: true
        })
            .then(res => setAcceptedShift(res.data))
            .catch(() => setAcceptedShift(null));
    }, [setTitle]);

    return (
        <div className="guard-home-page">
            <h3>Xin chào, {user.fullName}!</h3>
            <p><strong>Mã nhân viên:</strong> {user.identityNumber}</p>
            <div className="shift-box">
                <h4>Ca trực của bạn hôm nay:</h4>
                {acceptedShift ? (
                    <div className="shift-info">
                        <p><strong>Ca:</strong> {acceptedShift.timeSlot}</p>
                        <p><strong>Block:</strong> {acceptedShift.block}</p>
                        <p><strong>Ngày:</strong> {acceptedShift.shiftDate}</p>
                    </div>
                ) : (
                    <p>Bạn chưa có ca trực nào được chấp nhận hôm nay.</p>
                )}
            </div>
        </div>
    );
};

export default GuardHomePage;