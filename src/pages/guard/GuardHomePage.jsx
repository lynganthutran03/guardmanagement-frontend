import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import ShiftCalendar from './ShiftCalendar';
import './GuardHomePage.css';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
} from 'chart.js';

import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

const GuardHomePage = ({ user }) => {
    const { setTitle } = useContext(TitleContext);
    const [acceptedShift, setAcceptedShift] = useState([]);

    useEffect(() => {
        setTitle('Trang Chủ Bảo Vệ');
    }, [setTitle]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/shifts/calendar", { withCredentials: true })
            .then((res) => {
                const onlyAccepted = res.data.filter(shift => shift.employeeId !== null);
                setAcceptedShift(onlyAccepted);
            })
            .catch((err) => {
                console.error("Error fetching shift data:", err);
            });
    }, []);

    const pieData = {
        labels: ['Ca sáng', 'Ca Tối'],
        datasets: [
            {
                data: [10, 8],
                backgroundColor: ['#36A2EB', '#FFCE56'],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        datasets: [
            {
                label: 'Số ca đã nhận',
                data: [5, 7, 6, 8],
                backgroundColor: '#36A2EB',
            },
        ],
    };

    const absenceData = {
        labels: ['Tháng 6', 'Tháng 7', 'Tháng 8'],
        datasets: [
            {
                label: 'Số ngày vắng',
                data: [2, 1, 3],
                borderColor: '#FF6384',
            },
        ],
    };

    return (
        <div className="guard-home-page">
            <h3>Xin chào, {user.fullName}!</h3>
            <p><strong>Mã nhân viên:</strong> {user.identityNumber}</p>
            <div className="dashboard-layout">
                <div className="calendar-box">
                    <h4>Lịch trực tháng này:</h4>
                    <ShiftCalendar shiftData={acceptedShift} />
                </div>

                <div className="charts-box">
                    <div className="card">
                        <h4>Thống kê ca trực</h4>
                        <div className="chart-tall">
                            <Pie data={pieData} />
                        </div>
                    </div>
                    <div className="card">
                        <h4>Số ca theo tuần</h4>
                        <div className="chart-tall">
                            <Bar data={barData} options={{ maintainAspectRatio: false }}/>
                        </div>
                    </div>
                    <div className="card">
                        <h4>Số ngày vắng</h4>
                        <div className="chart-tall">
                            <Line data={absenceData} options={{ maintainAspectRatio: false }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuardHomePage;
