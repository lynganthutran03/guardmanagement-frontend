import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './MyShifts.css';
import { parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

axios.defaults.withCredentials = true;

const MyShifts = () => {
    const { setTitle } = useContext(TitleContext);
    const [shifts, setShifts] = useState([]);
    const [locationMap, setLocationMap] = useState({});
    const [timeSlotMap, setTimeSlotMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTitle('Lịch Sử Ca Trực');
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [locRes, tsRes, historyRes] = await Promise.all([
                    axios.get("/api/admin/locations", { withCredentials: true }),
                    axios.get("/api/admin/timeslots", { withCredentials: true }),
                    axios.get('/api/shifts/history', { withCredentials: true })
                ]);

                setLocationMap(Object.fromEntries(
                    locRes.data.map(loc => [loc.name, loc.name])
                ));
                setTimeSlotMap(Object.fromEntries(
                    tsRes.data.map(ts => [ts.name, `${ts.name} (${ts.startTime} - ${ts.endTime})`])
                ));

                setShifts(historyRes.data);
            } catch (err) {
                console.error("Lỗi tải dữ liệu", err);
                setShifts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [setTitle]);

    if (isLoading) {
        return <div className="shift-history-page"><p>Đang tải lịch sử...</p></div>;
    }

    const handleExportExcel = () => {
        if (shifts.length === 0) {
            return;
        }

        const exportData = shifts.map(shift => ({
            'Ngày': parseISO(shift.shiftDate).toLocaleDateString('vi-VN'),
            'Ca trực': timeSlotMap[shift.timeSlot] || shift.timeSlot,
            'Khu vực': locationMap[shift.location] || shift.location
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
        return <div className="shift-history-page"><p>Đang tải dữ liệu...</p></div>;
    }

    return (
        <div className="shift-history-page">
            <div className="shift-history-controls">
                <h2>Lịch Sử Ca Trực Của Bạn</h2>
                <button
                    onClick={handleExportExcel}
                    className="excel-export-btn"
                    disabled={shifts.length === 0}
                >
                    <i className="fa-solid fa-file-excel"></i> Xuất Excel
                </button>
            </div>

            <div className="shift-history-table">
                <div className="shift-history-header">
                    <span>Ngày</span>
                    <span>Ca trực</span>
                    <span>Khu vực</span>
                </div>

                {shifts.length === 0 ? (
                    <div className="shift-history-row empty-row">
                        <span>Không có ca trực nào trong quá khứ.</span>
                    </div>
                ) : (
                    shifts.map(shift => (
                        <div key={shift.id} className="shift-history-row">
                            <span>{parseISO(shift.shiftDate).toLocaleDateString('vi-VN')}</span>
                            <span>{timeSlotMap[shift.timeSlot] || shift.timeSlot}</span>
                            <span>{locationMap[shift.location] || shift.location}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyShifts;