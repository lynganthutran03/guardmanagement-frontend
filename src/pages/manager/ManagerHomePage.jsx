import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ManagerHomePage.css';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';

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

import { Pie, Bar } from 'react-chartjs-2';

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

axios.defaults.withCredentials = true;

const ManagerHomePage = () => {
    const { setTitle } = useContext(TitleContext);

    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTitle('Trang Chủ Quản Lý');
        fetchDashboardData();
    }, [setTitle]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/dashboard/manager");
            setStats(res.data);
        } catch (err) {
            console.error("Lỗi tải dashboard:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const pieData = {
        labels: ['Đúng giờ', 'Đi trễ', 'Vắng mặt'],
        datasets: [
            {
                data: [
                    stats?.presentCount || 0,
                    stats?.lateCount || 0,
                    stats?.absenceCount || 0
                ],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: ['Tuần này'],
        datasets: [
            {
                label: 'Đã phân ca',
                data: [stats?.assignedShifts || 0],
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Ca trống (Cần gán)',
                data: [stats?.openShifts || 0],
                backgroundColor: '#FF6384',
            },
        ],
    };

    if (isLoading) {
        return <div className="manager-home-page"><p>Đang tải dữ liệu tổng quan...</p></div>;
    }

    return (
        <div className="manager-home-page">
            <div className="dashboard-grid">
                <div className="card">
                    <h4>Thống kê chuyên cần (Tháng này)</h4>
                    <div className="chart-container" style={{ position: 'relative', height: '250px' }}>
                        {(stats?.presentCount + stats?.lateCount + stats?.absenceCount) > 0 ? (
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p className="text-muted text-center mt-4">Chưa có dữ liệu chấm công tháng này.</p>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h4>Tình trạng phân ca (Tuần này)</h4>
                    <div className="chart-tall">
                        <Bar
                            data={barData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: { beginAtZero: true, ticks: { precision: 0 } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="card">
                    <h4>Đơn nghỉ cần duyệt</h4>
                    {stats?.upcomingLeaves && stats.upcomingLeaves.length > 0 ? (
                        <ul className="leave-list">
                            {stats.upcomingLeaves.map((item, index) => (
                                <li key={index}>
                                    <strong>{item.guardName}</strong>
                                    <br />
                                    <small className="text-muted">
                                        {parseISO(item.startDate).toLocaleDateString('vi-VN')}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted text-center mt-4">Không có đơn nghỉ nào sắp tới.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerHomePage;