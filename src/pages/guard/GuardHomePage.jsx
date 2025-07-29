import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import ShiftCalendar from './ShiftCalendar';
import './GuardHomePage.css';

const GuardHomePage = ({ user }) => {
    const { setTitle } = useContext(TitleContext);
    const [acceptedShift, setAcceptedShift] = useState([]);

    useEffect(() => {
        setTitle('Trang Chủ Bảo Vệ');
    }, [setTitle]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/shifts/calendar", { withCredentials: true })
            .then((res) => {
                setAcceptedShift(res.data);
            })
            .catch((err) => {
                console.error("Error fetching shift data:", err);
            });
    }, []);

    return (
        <div className="guard-home-page">
            <h3>Xin chào, {user.fullName}!</h3>
            <p><strong>Mã nhân viên:</strong> {user.identityNumber}</p>
            <div className="dashboard-layout">
                <div className="calendar-box">
                    <h4>Lịch trực tháng này:</h4>
                    <ShiftCalendar shiftData={acceptedShift} />
                </div>
            </div>
        </div>
    );
};

export default GuardHomePage;
