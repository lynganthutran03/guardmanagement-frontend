import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import ShiftCalendar from './ShiftCalendar';
import './GuardHomePage.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const GuardHomePage = ({ user }) => {
    const { setTitle } = useContext(TitleContext);
    const [calendarShifts, setCalendarShifts] = useState([]);
    
    const [stats, setStats] = useState(null);

    useEffect(() => {
        setTitle('Trang Chủ Bảo Vệ');
        
        axios.get("/api/shifts/calendar", { withCredentials: true })
            .then((res) => {
                setCalendarShifts(res.data); 
            });

        axios.get("/api/dashboard/guard", { withCredentials: true })
            .then(res => setStats(res.data))
            .catch(err => console.error(err));

    }, [setTitle]);

    const pieData = stats ? {
        labels: ['Ca Sáng', 'Ca Tối'],
        datasets: [{
            data: [stats.totalDayShifts, stats.totalNightShifts],
            backgroundColor: ['#36A2EB', '#FFCE56'],
            borderWidth: 1,
        }],
    } : null;

    const barData = stats ? {
        labels: Object.keys(stats.weeklyShiftCounts),
        datasets: [{
            label: 'Số ca đã nhận',
            data: Object.values(stats.weeklyShiftCounts),
            backgroundColor: '#36A2EB',
        }],
    } : null;

    return (
        <div className="guard-home-page">
            <h3>Xin chào, {user.fullName}!</h3>
            <p><strong>Mã nhân viên:</strong> {user.identityNumber}</p>
            
            <div className="dashboard-layout">
                <div className="calendar-box">
                    <h4>Lịch trực tháng này:</h4>
                    <ShiftCalendar shiftData={calendarShifts} />
                </div>

                <div className="charts-box">
                    {stats && (
                        <>
                            <div className="card">
                                <h4>Thống kê ca trực (Tháng này)</h4>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuardHomePage;