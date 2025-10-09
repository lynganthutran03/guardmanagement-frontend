import React, { useState, useContext, useEffect } from 'react';
import { TitleContext } from '../../context/TitleContext';
import './ShiftReassign.css';

const mockGuards = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
    { id: 4, name: 'Phạm Thị D' },
];

const mockShifts = [
    { guardId: 1, date: '2025-08-11', timeSlot: 'MORNING', block: 'BLOCK_10' },
    { guardId: 2, date: '2025-07-31', timeSlot: 'AFTERNOON', block: 'BLOCK_5' },
    { guardId: 3, date: '2025-07-30', timeSlot: 'EVENING', block: 'BLOCK_4' },
    { guardId: 4, date: '2025-07-31', timeSlot: 'MORNING', block: 'BLOCK_6' },
    { guardId: 1, date: '2025-08-16', timeSlot: 'MORNING', block: 'BLOCK_8' },
    { guardId: 4, date: '2025-08-20', timeSlot: 'MORNING', block: 'BLOCK_10' },
];

const ShiftReassign = () => {
    const { setTitle } = useContext(TitleContext);
    const [absentGuardId, setAbsentGuardId] = useState('');
    const [absentDate, setAbsentDate] = useState('');
    const [absentShift, setAbsentShift] = useState(null);

    const [selectedGuardId, setSelectedGuardId] = useState('');
    const [newDate, setNewDate] = useState('');
    const [guardShift, setGuardShift] = useState(null);

    useEffect(() => {
        setTitle('Phân Công Ca Trực Bù');
    }, [setTitle]);

    useEffect(() => {
        if (absentGuardId && absentDate) {
            const found = mockShifts.find(
                shift =>
                    shift.guardId === parseInt(absentGuardId) &&
                    shift.date === absentDate
            );
            setAbsentShift(found || null);
        } else {
            setAbsentShift(null);
        }
    }, [absentGuardId, absentDate]);

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
        if (!absentGuardId || !absentDate || !selectedGuardId || !newDate) {
            alert("Vui lòng chọn đầy đủ thông tin hoán đổi.");
            return;
        }

        const absentGuard = mockGuards.find(g => g.id === parseInt(absentGuardId));
        const replacementGuard = mockGuards.find(g => g.id === parseInt(selectedGuardId));

        alert(`Đã hoán đổi ca ngày ${absentDate} của ${absentGuard.name} với ca ngày ${newDate} của ${replacementGuard.name}`);
    };

    return (
        <div className="reassign-container">
            <div className="shift-swap-panel">
                <div className="shift-card absent-card">
                    <h4>Ca nghỉ cần hoán đổi</h4>

                    <label>Chọn nhân viên:</label>
                    <select
                        value={absentGuardId}
                        onChange={e => setAbsentGuardId(e.target.value)}
                    >
                        <option value="">-- Chọn bảo vệ --</option>
                        {mockGuards.map(guard => (
                            <option key={guard.id} value={guard.id}>{guard.name}</option>
                        ))}
                    </select>

                    <label>Chọn ngày nghỉ:</label>
                    <input
                        type="date"
                        value={absentDate}
                        onChange={e => setAbsentDate(e.target.value)}
                        min="2025-07-01"
                    />

                    {absentShift ? (
                        <div className="guard-shift-info">
                            <p><strong>Ngày:</strong> {absentShift.date}</p>
                            <p><strong>Ca:</strong> {absentShift.timeSlot}</p>
                            <p><strong>Block:</strong> {absentShift.block}</p>
                        </div>
                    ) : (
                        absentGuardId && absentDate && <p className="no-shift">Không tìm thấy ca trực</p>
                    )}
                </div>

                <div className="swap-icon">
                    <i className="fas fa-right-left"></i>
                </div>

                <div className="shift-card replacement-card">
                    <h4>Nhân viên thay thế</h4>
                    <label>Chọn nhân viên:</label>
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
                            <p><strong>Ngày:</strong> {guardShift.date}</p>
                            <p><strong>Ca:</strong> {guardShift.timeSlot}</p>
                            <p><strong>Block:</strong> {guardShift.block}</p>
                        </div>
                    ) : (
                        selectedGuardId && newDate && <p className="no-shift">Không tìm thấy ca trực</p>
                    )}
                </div>
            </div>

            <div className="swap-actions">
                <button className="cancel-btn">Hủy</button>
                <button className="confirm-btn" onClick={handleReassign}>Xác Nhận Hoán Đổi</button>
            </div>
        </div>
    );
};

export default ShiftReassign;
