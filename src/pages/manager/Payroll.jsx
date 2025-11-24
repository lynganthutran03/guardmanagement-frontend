import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import './Payroll.css';

axios.defaults.withCredentials = true;

const Payroll = () => {
    const { setTitle } = useContext(TitleContext);
    const [payrollData, setPayrollData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    useEffect(() => {
        setTitle('Quản Lý Bảng Lương');
    }, [setTitle]);

    useEffect(() => {
        fetchPayroll();
    }, [selectedMonth, selectedYear]);

    const fetchPayroll = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/manager/payroll?month=${selectedMonth}&year=${selectedYear}`);
            setPayrollData(res.data || []);
        } catch (err) {
            toast.error("Không thể tải bảng lương.");
            setPayrollData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleExportExcel = () => {
        if (payrollData.length === 0) {
            toast.warn("Không có dữ liệu để xuất.");
            return;
        }
        toast.info("Đang xuất file Excel...");

        const exportData = payrollData.map(item => ({
            'ID': item.id,
            'Mã NV': item.identityNumber,
            'Họ và Tên': item.fullname,
            'Tổng Ca': item.totalShifts,
            'Tổng Giờ': item.totalHours,
            'Số lần trễ': item.lateCount,
            'Tổng Lương': item.totalSalary
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Luong_T${selectedMonth}_${selectedYear}`);

        const cols = Object.keys(exportData[0]).map(key => ({ wch: 20 }));
        ws["!cols"] = cols;

        XLSX.writeFile(wb, `BangLuong_Thang${selectedMonth}_${selectedYear}.xlsx`);
    };

    return (
        <div className="payroll-page">
            <div className="payroll-filters">
                <div className="select-group">
                    <label>Tháng:</label>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>Tháng {m}</option>
                        ))}
                    </select>
                </div>

                <div className="select-group">
                    <label>Năm:</label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="excel-export-btn"
                    onClick={handleExportExcel}
                    disabled={payrollData.length === 0}
                >
                    <i className="fa-solid fa-file-excel"></i> Xuất Báo Cáo
                </button>
            </div>

            <div className="payroll-table-container">
                <table className="payroll-table">
                    <thead>
                        <tr>
                            <th>Mã bảo vệ</th>
                            <th>Họ và Tên</th>
                            <th className="text-center">Số Ca</th>
                            <th className="text-center">Tổng Giờ</th>
                            <th className="text-center">Vi Phạm (Trễ)</th>
                            <th className="text-right">Tổng Lương</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" className="text-center">Đang tính toán...</td></tr>
                        ) : payrollData.length > 0 ? (
                            payrollData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.identityNumber}</td>
                                    <td>{item.fullname}</td>
                                    <td className="text-center">{item.totalShifts}</td>
                                    <td className="text-center">{item.totalHours}</td>
                                    <td className="text-center late-col">
                                        {item.lateCount > 0 ? <span className="late-tag">{item.lateCount}</span> : '-'}
                                    </td>
                                    <td className="text-right salary-col">{formatCurrency(item.totalSalary)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center">Không có dữ liệu chấm công trong tháng này.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payroll;