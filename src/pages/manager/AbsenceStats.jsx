import React, { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../../context/TitleContext';
import Select from "react-select";
import './AbsenceStats.css';

const absences = [
    { id: 'G001', name: 'Nguyễn Văn A', date: '05/08/2025', reason: 'Bệnh' },
    { id: 'G002', name: 'Trần Thị B', date: '06/08/2025', reason: 'Cá nhân' },
    { id: 'G003', name: 'Lê Văn C', date: '06/08/2025', reason: 'Gia đình' },
];

const AbsenceStats = () => {
    const { setTitle } = useContext(TitleContext);

    const [selectedNames, setSelectedNames] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        setTitle('Thống Kê Buổi Vắng');
    }, [setTitle]);

    // Build unique options
    const nameOptions = [...new Set(absences.map(a => a.name))].map(name => ({
        value: name,
        label: name
    }));
    const dateOptions = [...new Set(absences.map(a => a.date))].map(date => ({
        value: date,
        label: date
    }));
    const idOptions = [...new Set(absences.map(a => a.id))].map(id => ({
        value: id,
        label: id
    }));

    // Filtering logic
    const filteredAbsences = absences.filter(a => {
        const matchName = selectedNames.length ? selectedNames.some(n => n.value === a.name) : true;
        const matchDate = selectedDates.length ? selectedDates.some(d => d.value === a.date) : true;
        const matchId = selectedIds.length ? selectedIds.some(id => id.value === a.id) : true;
        return matchName && matchDate && matchId;
    });

    return (
        <div className="absence-page">
            {/* Filters */}
            <div className="filters">
                <Select
                    options={nameOptions}
                    isMulti
                    placeholder="Chọn tên"
                    value={selectedNames}
                    onChange={setSelectedNames}
                />
                <Select
                    options={idOptions}
                    isMulti
                    placeholder="Chọn ID"
                    value={selectedIds}
                    onChange={setSelectedIds}
                />
                <Select
                    options={dateOptions}
                    isMulti
                    placeholder="Chọn ngày"
                    value={selectedDates}
                    onChange={setSelectedDates}
                />
            </div>

            {/* Table */}
            <div className="absence-table">
                <div className="absence-header">
                    <span>ID</span>
                    <span>Tên</span>
                    <span>Ngày</span>
                    <span>Lý do</span>
                </div>
                {filteredAbsences.length > 0 ? (
                    filteredAbsences.map((a, i) => (
                        <div className="absence-row" key={i}>
                            <span>{a.id}</span>
                            <span>{a.name}</span>
                            <span>{a.date}</span>
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
