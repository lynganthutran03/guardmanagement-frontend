import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './MyShifts.css';
import { parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

axios.defaults.withCredentials = true;

const statusMap = {
    PRESENT: { text: "Có mặt", className: "present" },
    LATE: { text: "Đi trễ", className: "late" },
    ABSENT: { text: "Vắng mặt", className: "absent" }
};

const MyShifts = () => {
    const { setTitle } = useContext(TitleContext);
    const [shifts, setShifts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTitle('Lịch Sử Ca Trực');
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get('/api/shifts/history');
                if (Array.isArray(res.data)) {
                    setShifts(res.data);
                }
            } catch (err) {
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [setTitle]);

    const formatTimeSlot = (shift) => {
        if (shift.startTime && shift.endTime) {
            const start = shift.startTime.toString().slice(0, 5);
            const end = shift.endTime.toString().slice(0, 5);

            return `${start} - ${end}`;
        }
        return shift.timeSlot;
    }

    const formatCheckInTime = (timeString) => {
        if (!timeString) return "-";
        return new Date(timeString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    const handleExportExcel = () => {
        if (shifts.length === 0) {
            return;
        }

        const exportData = shifts.map(shift => ({
            'Ngày': parseISO(shift.shiftDate).toLocaleDateString('vi-VN'),
            'Ca trực': formatTimeSlot(shift),
            'Khu vực': shift.location,
            'Trạng thái': statusMap[shift.attendanceStatus] || "Chưa rõ",
            'Giờ điểm danh': shift.checkInTime ? new Date(shift.checkInTime).toLocaleTimeString('vi-VN') : '-'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "LichSuCaTruc");

        const cols = Object.keys(exportData[0] || {}).map(key => ({
            wch: Math.max(key.length, ...exportData.map(row => (row[key] || "").toString().length)) + 2
        }));
        ws["!cols"] = cols;

        XLSX.writeFile(wb, "LichSuCaTruc_CaNhan.xlsx");
    };

    if (isLoading) {
        return <div className="shift-history-page"><p>Đang tải lịch sử...</p></div>;
    }
    return (
        <div className="shift-history-page">
            <div className="shift-history-controls">
                <button onClick={handleExportExcel} className="excel-export-btn" disabled={shifts.length === 0}>
                    <i className="fa-solid fa-file-excel"></i> Xuất Excel
                </button>
            </div>

            <div className="shift-history-table">
                <div className="shift-history-header">
                    <span>Ngày</span>
                    <span>Ca trực</span>
                    <span>Khu vực</span>
                    <span style={{ textAlign: 'center' }}>Trạng thái</span>
                    <span style={{ textAlign: 'center' }}>Giờ điểm danh</span>
                </div>

                {shifts.length === 0 ? (
                    <div className="shift-history-row empty-row">
                        <span>Không có dữ liệu lịch sử.</span>
                    </div>
                ) : (
                    shifts.map(shift => {
                        const statusInfo = statusMap[shift.attendanceStatus] || { text: shift.attendanceStatus || "Chưa rõ", className: "pending" };

                        return (
                            <div key={shift.id} className="shift-history-row">
                                <span>{parseISO(shift.shiftDate).toLocaleDateString('vi-VN')}</span>
                                <span>{formatTimeSlot(shift)}</span>
                                <span>{shift.location}</span>
                                <span style={{ textAlign: 'center' }}>
                                    <span className={`status-tag ${statusInfo.className}`}>
                                        {statusInfo.text}
                                    </span>
                                </span>
                                <span style={{ textAlign: 'center', fontSize: '0.9em', color: '#666' }}>
                                    {formatCheckInTime(shift.checkInTime)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyShifts;