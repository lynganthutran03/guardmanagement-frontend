import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import { toast } from 'react-toastify';
import './MyPayroll.css';

axios.defaults.withCredentials = true;

const MyPayroll = () => {
    const { setTitle } = useContext(TitleContext);
    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    useEffect(() => {
        setTitle('Bảng Lương Cá Nhân');
    }, [setTitle]);

    useEffect(() => {
        fetchPayroll();
    }, [selectedMonth, selectedYear]);

    const fetchPayroll = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/my-payroll?month=${selectedMonth}&year=${selectedYear}`);
            setPayroll(res.data);
        } catch (err) {
            toast.error("Không thể tải bảng lương.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="my-payroll-page">
            <div className="payroll-filter">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>Tháng {m}</option>
                    ))}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                    {[2024, 2025, 2026].map(y => (
                        <option key={y} value={y}>Năm {y}</option>
                    ))}
                </select>
                <button onClick={fetchPayroll} className="view-btn">Xem Lương</button>
            </div>

            {loading ? (
                <p>Đang tính toán...</p>
            ) : payroll ? (
                <div className="payroll-card">
                    <div className="payroll-header">
                        <h4>Phiếu Lương Tháng {selectedMonth}/{selectedYear}</h4>
                        <span className="total-amount">{formatCurrency(payroll.totalSalary)}</span>
                    </div>

                    <div className="payroll-details">
                        <div className="detail-item">
                            <span>Tổng số ca làm:</span>
                            <strong>{payroll.totalShifts} ca</strong>
                        </div>
                        <div className="detail-item">
                            <span>Tổng số giờ làm:</span>
                            <strong>{payroll.totalHours} giờ</strong>
                        </div>
                        <div className="detail-item warning">
                            <span>Số lần đi trễ:</span>
                            <strong>{payroll.lateCount} lần</strong>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Không có dữ liệu lương cho tháng này.</p>
            )}
        </div>
    );
};

export default MyPayroll;