import React, { useState, useContext, useEffect } from 'react';
import { TitleContext } from '../../context/TitleContext';
import './ShiftReassign.css';

const mockLeaveShift = {
    id: 101,
    date: '2025-07-30',
    guard: 'Nguyễn Văn A',
    timeSlot: 'MORNING',
    block: 'BLOCK_3'
};

const mockGuards = [
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
    { id: 4, name: 'Phạm Thị D' },
];

const mockShifts = [
    { guardId: 2, date: '2025-07-31', timeSlot: 'AFTERNOON', block: 'BLOCK_5' },
    { guardId: 3, date: '2025-07-30', timeSlot: 'EVENING', block: 'BLOCK_4' },
    { guardId: 4, date: '2025-07-31', timeSlot: 'MORNING', block: 'BLOCK_6' },
];

const ShiftReassign = () => {
    const { setTitle } = useContext(TitleContext);
    const [selectedGuardId, setSelectedGuardId] = useState('');
    const [newDate, setNewDate] = useState('');
    const [guardShift, setGuardShift] = useState(null);

    useEffect(() => {
        setTitle('Duyệt Ca Trực Bù');
    }, [setTitle]);

    useEffect(() => {
        if (selectedGuardId && newDate) {
            const found = mockShifts.find(
                shift =>
                    shift.guardId === parseInt(selectedGuardId) &&
                    shift.date === newDate
            );
            setGuardShift(found || null);
        } else {
            setGuardShift(null);
        }
    }, [selectedGuardId, newDate]);

    const handleReassign = () => {
        if (!selectedGuardId || !newDate) {
            alert("Vui lòng chọn nhân viên và ngày hoán đổi.");
            return;
        }

        const guard = mockGuards.find(g => g.id === parseInt(selectedGuardId));
        alert(`Đã hoán đổi ca ngày ${mockLeaveShift.date} của ${mockLeaveShift.guard} với ca ngày ${newDate} của ${guard.name}`);
    };

    return (
        <div className="reassign-container">
            <h2>Hoán Đổi Ca Trực</h2>

            <div className="leave-shift-box">
                <h4>Ca nghỉ cần hoán đổi</h4>
                <p><strong>Nhân viên:</strong> {mockLeaveShift.guard}</p>
                <p><strong>Ngày:</strong> {mockLeaveShift.date}</p>
                <p><strong>Ca:</strong> {mockLeaveShift.timeSlot}</p>
                <p><strong>Block:</strong> {mockLeaveShift.block}</p>
            </div>

            <div className="reassign-form">
                <label>Chọn nhân viên thay thế:</label>
                <select value={selectedGuardId} onChange={e => setSelectedGuardId(e.target.value)}>
                    <option value="">-- Chọn bảo vệ --</option>
                    {mockGuards.map(guard => (
                        <option key={guard.id} value={guard.id}>{guard.name}</option>
                    ))}
                </select>

                <label>Chọn ngày hoán đổi:</label>
                <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    min="2025-07-01"
                />

                {guardShift ? (
                    <div className="guard-shift-info">
                        <h4>Ca hiện tại của bảo vệ:</h4>
                        <p><strong>Ngày:</strong> {guardShift.date}</p>
                        <p><strong>Ca:</strong> {guardShift.timeSlot}</p>
                        <p><strong>Block:</strong> {guardShift.block}</p>
                    </div>
                ) : (
                    selectedGuardId && newDate && <p>Không tìm thấy ca trực cho nhân viên này vào ngày đã chọn.</p>
                )}

                <button onClick={handleReassign}>Hoán Đổi</button>
            </div>
        </div>
    );
};

export default ShiftReassign;
