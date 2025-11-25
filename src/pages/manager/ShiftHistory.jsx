import React, { useEffect, useContext, useState, useMemo } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import Select from "react-select";
import './ShiftHistory.css';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

const timeSlotMap = {
    DAY_SHIFT: "Ca Sáng (07:30 - 14:30)",
    NIGHT_SHIFT: "Ca Tối (14:30 - 21:30)"
};
const locationMap = {
    BLOCK_3: "Block 3", BLOCK_4: "Block 4", BLOCK_5: "Block 5",
    BLOCK_6: "Block 6", BLOCK_8: "Block 8", BLOCK_10: "Block 10",
    BLOCK_11: "Block 11", GATE_1: "Gate 1", GATE_2: "Gate 2", GATE_3: "Gate 3"
};

const statusMap = {
    PRESENT: { text: "Có mặt", className: "present" },
    LATE: { text: "Đi trễ", className: "late" },
    ABSENT: { text: "Vắng mặt", className: "absent" }
};

axios.defaults.withCredentials = true;

const ShiftHistory = () => {
    const { setTitle } = useContext(TitleContext);

    const [allShifts, setAllShifts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGuards, setSelectedGuards] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

    useEffect(() => {
        setTitle('Lịch Sử Ca Trực (Toàn Bộ)');
        fetchShiftHistory();
    }, [setTitle]);

    const fetchShiftHistory = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/manager/all-shifts");
            if (Array.isArray(res.data)) {
                setAllShifts(res.data);
            }
        } catch (err) {
            toast.error("Không thể tải lịch sử ca trực.");
        } finally {
            setIsLoading(false);
        }
    };

    const guardOptions = useMemo(() =>
        [...new Map(allShifts.map(s => [s.guardIdentityNumber, s.guardName])).entries()]
            .filter(([identityNumber, name]) => identityNumber && name)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([identityNumber, name]) => ({
                value: identityNumber,
                label: `${name} (${identityNumber})`
            })),
        [allShifts]
    );

    const locationOptions = useMemo(() =>
        [...new Set(allShifts.map(s => s.location))].map(loc => ({
            value: loc,
            label: locationMap[loc] || loc
        })).sort((a, b) => a.label.localeCompare(b.label)),
        [allShifts]
    );

    const timeSlotOptions = useMemo(() =>
        [...new Set(allShifts.map(s => s.timeSlot))].map(ts => ({
            value: ts,
            label: timeSlotMap[ts] || ts
        })).sort((a, b) => a.label.localeCompare(b.label)),
        [allShifts]
    );

    const filteredShifts = useMemo(() => allShifts.filter(s => {
        const matchGuard = selectedGuards.length ? selectedGuards.some(g => g.value === s.guardIdentityNumber) : true;
        const matchLocation = selectedLocations.length ? selectedLocations.some(l => l.value === s.location) : true;
        const matchTimeSlot = selectedTimeSlots.length ? selectedTimeSlots.some(ts => ts.value === s.timeSlot) : true;

        if (selectedGuards.length > 0 && !s.guardIdentityNumber) {
            return false;
        }

        return matchGuard && matchLocation && matchTimeSlot;
    }), [allShifts, selectedGuards, selectedLocations, selectedTimeSlots]);

    const handleExportExcel = () => {
        if (filteredShifts.length === 0) {
            toast.warn("Không có dữ liệu để xuất.");
            return;
        }
        toast.info("Đang chuẩn bị file Excel...");

        const exportData = filteredShifts.map(s => ({
            'Ngày': parseISO(s.shiftDate).toLocaleDateString('vi-VN'),
            'Tên Bảo Vệ': s.guardName || '(Chưa gán)',
            'Mã Bảo Vệ': s.guardIdentityNumber || '',
            'Ca Trực': timeSlotMap[s.timeSlot] || s.timeSlot,
            'Khu Vực': locationMap[s.location] || s.location
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "LichSuCaTruc");

        const cols = Object.keys(exportData[0] || {}).map(key => ({
            wch: Math.max(key.length, ...exportData.map(row => (row[key] || "").toString().length)) + 2
        }));
        ws["!cols"] = cols;

        XLSX.writeFile(wb, "LichSuCaTruc_DaLoc.xlsx");
    };

    if (isLoading) {
        return <div className="shift-history-page"><p>Đang tải dữ liệu...</p></div>;
    }

    return (
        <div className="shift-history-page">
            <div className="filters">
                <Select
                    options={guardOptions}
                    isMulti
                    placeholder="Lọc theo Tên Bảo Vệ..."
                    value={selectedGuards}
                    onChange={setSelectedGuards}
                    className="filter-select"
                />
                <Select
                    options={locationOptions}
                    isMulti
                    placeholder="Lọc theo Khu Vực..."
                    value={selectedLocations}
                    onChange={setSelectedLocations}
                    className="filter-select"
                />
                <Select
                    options={timeSlotOptions}
                    isMulti
                    placeholder="Lọc theo Ca Trực..."
                    value={selectedTimeSlots}
                    onChange={setSelectedTimeSlots}
                    className="filter-select"
                />
                <button
                    onClick={handleExportExcel}
                    className="excel-export-btn"
                    disabled={filteredShifts.length === 0}
                >
                    <i className="fa-solid fa-file-excel"></i> Xuất Excel
                </button>
            </div>

            <div className="shift-history-table">
                <div className="shift-history-header" style={{ gridTemplateColumns: '1fr 2fr 1fr 2fr 1fr 1fr' }}>
                    <span>Ngày</span>
                    <span>Tên Bảo Vệ</span>
                    <span>Mã Bảo Vệ</span>
                    <span>Ca Trực</span>
                    <span>Khu Vực</span>
                    <span style={{textAlign: 'center'}}>Trạng thái</span>
                </div>
                {filteredShifts.length > 0 ? (
                    filteredShifts.map((s, i) => {
                        const statusInfo = statusMap[s.attendanceStatus] || { text: "Chưa rõ", className: "pending" };
                        return (
                            <div className="shift-history-row" key={s.id || i} style={{ gridTemplateColumns: '1fr 2fr 1fr 2fr 1fr 1fr' }}>
                                <span>{parseISO(s.shiftDate).toLocaleDateString('vi-VN')}</span>
                                <span>{s.guardName || '(Chưa gán)'}</span>
                                <span>{s.guardIdentityNumber || ''}</span>
                                <span>{timeSlotMap[s.timeSlot] || s.timeSlot}</span>
                                <span>{locationMap[s.location] || s.location}</span>
                                
                                <span style={{textAlign: 'center'}}>
                                    <span className={`status-tag ${statusInfo.className}`}>
                                        {statusInfo.text}
                                    </span>
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="shift-history-row" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                        Không có dữ liệu
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShiftHistory;