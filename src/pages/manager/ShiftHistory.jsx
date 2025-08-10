import React, { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../../context/TitleContext';
import Select from "react-select";
import './ShiftHistory.css';

const shiftData = {
    '05/08': [
        { id: 'G001', block: 3, shift: 'MORNING' },
        { id: 'G002', block: 5, shift: 'AFTERNOON' },
    ],
    '06/08': [
        { id: 'G003', block: 6, shift: 'EVENING' },
        { id: 'G002', block: 8, shift: 'MORNING' },
    ],
};

const ShiftHistory = () => {
    const dateOptions = Object.keys(shiftData).map((date) => ({
        value: date,
        label: date,
    }));

    const idOptions = [...new Set(Object.values(shiftData).flat().map(s => s.id))].map(id => ({
        value: id,
        label: id,
    }));

    const blockOptions = [...new Set(Object.values(shiftData).flat().map(s => s.block))].map(block => ({
        value: block,
        label: block,
    }));

    const shiftOptions = [...new Set(Object.values(shiftData).flat().map(s => s.shift))].map(shift => ({
        value: shift,
        label: shift,
    }));

    const { setTitle } = useContext(TitleContext);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [selectedShifts, setSelectedShifts] = useState([]);

    useEffect(() => {
        setTitle('Lịch Sử Ca Trực');
    }, [setTitle]);

    const filteredData = Object.keys(shiftData).reduce((acc, date) => {
        if (selectedDates.length && !selectedDates.some(d => d.value === date)) return acc;

        const filteredShifts = shiftData[date].filter(s => {
            const matchId = selectedIds.length ? selectedIds.some(id => id.value === s.id) : true;
            const matchBlock = selectedBlocks.length ? selectedBlocks.some(b => b.value === s.block) : true;
            const matchShift = selectedShifts.length ? selectedShifts.some(sh => sh.value === s.shift) : true;
            return matchId && matchBlock && matchShift;
        });

        if (filteredShifts.length) acc[date] = filteredShifts;
        return acc;
    }, {});

    return (
        <div className="shift-history-page">
            {/* Filters */}
            <div className="filters">
                <Select
                    options={dateOptions}
                    isMulti
                    placeholder="Chọn ngày"
                    value={selectedDates}
                    onChange={setSelectedDates}
                />
                <Select
                    options={idOptions}
                    isMulti
                    placeholder="Chọn ID"
                    value={selectedIds}
                    onChange={setSelectedIds}
                />
                <Select
                    options={blockOptions}
                    isMulti
                    placeholder="Chọn Block"
                    value={selectedBlocks}
                    onChange={setSelectedBlocks}
                />
                <Select
                    options={shiftOptions}
                    isMulti
                    placeholder="Chọn Ca"
                    value={selectedShifts}
                    onChange={setSelectedShifts}
                />
            </div>

            {/* Shift Table */}
            {Object.keys(filteredData).map((date) => (
                <div className="shift-card" key={date}>

                    <div className="shift-header">
                        <h4>{date}</h4>
                    </div>

                    <div className="shift-table">
                        <div className="shift-table-header">
                            <div>ID</div>
                            <div>Block</div>
                            <div>Ca</div>
                        </div>
                        {filteredData[date].map((s, i) => (
                            <div className="shift-table-row" key={i}>
                                <div>{s.id}</div>
                                <div>{s.block}</div>
                                <div>{s.shift}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShiftHistory;
