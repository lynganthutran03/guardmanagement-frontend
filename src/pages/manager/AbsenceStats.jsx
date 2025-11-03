import React, { useEffect, useContext, useState, useMemo } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import Select from "react-select";
import './AbsenceStats.css';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

axios.defaults.withCredentials = true;

const AbsenceStats = () => {
    const { setTitle } = useContext(TitleContext);

    const [allAbsences, setAllAbsences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNames, setSelectedNames] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        setTitle('Thống Kê Buổi Vắng');
        fetchApprovedRequests();
    }, [setTitle]);

    const fetchApprovedRequests = async () => {
        setIsLoading(true);
        let dataToSet = [];
        try {
            const res = await axios.get("/api/leave-requests/approved");
            if (Array.isArray(res.data)) {
                dataToSet = res.data;
            }
        } catch (err) {
            toast.error("Không thể tải danh sách thống kê.");
        } finally {
            setAllAbsences(dataToSet);
            setIsLoading(false);
        }
    };

    const nameOptions = useMemo(() =>
        [...new Set(allAbsences.map(a => a.guardName))].map(name => ({
            value: name,
            label: name
        })), [allAbsences]
    );
    const idOptions = useMemo(() =>
        [...new Set(allAbsences.map(a => a.guardIdentityNumber.toString()))].map(identityNumber => ({
            value: identityNumber,
            label: `ID: ${identityNumber}`
        })), [allAbsences]
    );
    const dateOptions = useMemo(() =>
        [...new Set(allAbsences.map(a => a.startDate))].map(date => ({
            value: date,
            label: parseISO(date).toLocaleDateString('vi-VN')
        })), [allAbsences]
    );

    const filteredAbsences = allAbsences.filter(a => {
        const matchName = selectedNames.length ? selectedNames.some(n => n.value === a.guardName) : true;
        const matchDate = selectedDates.length ? selectedDates.some(d => d.value === a.startDate) : true;
        const matchId = selectedIds.length ? selectedIds.some(id => id.value === a.guardIdentityNumber) : true;

        return matchName && matchDate && matchId;
    });

    const handleExportExcel = () => {
        if (filteredAbsences.length === 0) {
            toast.warn("Không có dữ liệu để xuất.");
            return;
        }
        toast.info("Đang chuẩn bị file Excel...");

        const exportData = filteredAbsences.map(a => ({
            'ID Bảo vệ': a.guardIdentityNumber,
            'Tên Bảo vệ': a.guardName,
            'Ngày bắt đầu': parseISO(a.startDate).toLocaleDateString('vi-VN'),
            'Ngày kết thúc': parseISO(a.endDate).toLocaleDateString('vi-VN'),
            'Lý do': a.reason,
            'Yêu cầu lúc': parseISO(a.requestedAt).toLocaleString('vi-VN')
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ThongKeVangMat");

        const cols = Object.keys(exportData[0] || {}).map(key => ({
            wch: Math.max(key.length, ...exportData.map(row => (row[key] || "").toString().length)) + 2
        }));
        ws["!cols"] = cols;

        XLSX.writeFile(wb, "ThongKeVangMat_DaLoc.xlsx");
    };

    if (isLoading) {
        return <div className="absence-page"><p>Đang tải dữ liệu...</p></div>;
    }

    return (
        <div className="absence-page">
            <div className="filters">
                <Select
                    options={nameOptions}
                    isMulti
                    placeholder="Chọn tên"
                    value={selectedNames}
                    onChange={setSelectedNames}
                    className="filter-select"
                />
                <Select
                    options={idOptions}
                    isMulti
                    placeholder="Chọn ID"
                    value={selectedIds}
                    onChange={setSelectedIds}
                    className="filter-select"
                />
                <Select
                    options={dateOptions}
                    isMulti
                    placeholder="Chọn ngày bắt đầu"
                    value={selectedDates}
                    onChange={setSelectedDates}
                    className="filter-select"
                />
                <button
                    onClick={handleExportExcel}
                    className="excel-export-btn"
                    disabled={filteredAbsences.length === 0}
                >
                    <i className="fa-solid fa-file-excel"></i> Xuất Excel
                </button>
            </div>

            <div className="absence-table">
                <div className="absence-header">
                    <span>ID Bảo vệ</span>
                    <span>Tên Bảo vệ</span>
                    <span>Ngày bắt đầu</span>
                    <span>Ngày kết thúc</span>
                    <span>Lý do</span>
                </div>

                {filteredAbsences.length > 0 ? (
                    filteredAbsences.map((a, i) => (
                        <div className="absence-row" key={i}>
                            <span>{a.guardIdentityNumber}</span>
                            <span>{a.guardName}</span>
                            <span>{parseISO(a.startDate).toLocaleDateString('vi-VN')}</span>
                            <span>{parseISO(a.endDate).toLocaleDateString('vi-VN')}</span>
                            <span>{a.reason}</span>
                        </div>
                    ))
                ) : (
                    <div className="absence-row no-data">
                        Không có dữ liệu
                    </div>
                )}
            </div>
        </div>
    );
};

export default AbsenceStats;