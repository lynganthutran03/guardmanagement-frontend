import { React, useEffect, useContext } from 'react';
import { TitleContext } from '../../context/TitleContext';
import './ManagerHomePage.css';

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

const ManagerHomePage = ({ }) => {
    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        setTitle('Trang Chủ Quản Lý');
    }, [setTitle]);

    const pieData = {
        labels: ['Có mặt', 'Vắng mặt'],
        datasets: [
            {
                data: [20, 4],
                backgroundColor: ['#36A2EB', '#FF6384'],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: ['Sáng', 'Chiều', 'Tối'],
        datasets: [
            {
                label: 'Đã phân ca',
                data: [10, 12, 8],
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Chưa phân ca',
                data: [2, 1, 3],
                backgroundColor: '#FFCE56',
            },
        ],
    };

    const lineData = {
        labels: ['01/08', '02/08', '03/08', '04/08', '05/08'],
        datasets: [
            {
                label: 'Tỉ lệ điểm danh (%)',
                data: [90, 85, 92, 88, 95],
                borderColor: '#36A2EB',
                backgroundColor: '#36A2EB33',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const horizontalBarData = {
        labels: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'],
        datasets: [
            {
                label: 'Số giờ tăng ca',
                data: [12, 9, 7],
                backgroundColor: '#FF6384',
            },
        ],
    };

    const leaveList = [
        { name: 'Nguyễn Văn A', date: '09/08' },
        { name: 'Trần Thị B', date: '10/08' },
        { name: 'Phạm C', date: '12/08' },
    ];

    return (
        <div className="manager-home-page">
            {/* DASHBOARD GRID START */}
            <div className="dashboard-grid">
                <div className="card">
                    <h4>Vắng mặt hôm nay</h4>
                    <Pie data={pieData} />
                </div>

                <div className="card">
                    <h4>Tình trạng phân ca</h4>
                    <div className="chart-tall">
                        <Bar
                            data={barData}
                            options={{ maintainAspectRatio: false }}
                        />
                    </div>
                </div>

                <div className="card">
                    <h4>Đơn nghỉ sắp tới</h4>
                    <ul className="leave-list">
                        {leaveList.map((item, index) => (
                            <li key={index}>
                                <strong>{item.name}</strong> – {item.date}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <h4>Xu hướng điểm danh</h4>
                    <div className="chart-tall">
                        <Line
                            data={lineData}
                            options={{ maintainAspectRatio: false }}
                        />
                    </div>
                </div>

                <div className="card">
                    <h4>Top tăng ca</h4>
                    <div className="chart-tall">
                        <Bar
                            data={horizontalBarData}
                            options={{
                                indexAxis: 'y',
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerHomePage;