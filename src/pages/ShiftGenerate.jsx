import React from 'react';
import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../context/TitleContext';
import './ShiftGenerate.css';

axios.defaults.withCredentials = true;

const ShiftGenerate = () => {
    const { setTitle } = useContext(TitleContext);
    const [shifts, setShifts] = useState([]);
    const [currentShift, setCurrentShift] = useState(null);
    const [retries, setRetries] = useState(0);
    const [mode, setMode] = useState('TIME');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');

    useEffect(() => {
        setTitle('Tạo Lịch Làm Việc');
        fetchGeneratedShifts();
    }, [setTitle]);

    const fetchGeneratedShifts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/shifts/today', {
                withCredentials: true
            });
            setShifts(res.data);
        } catch (err) {
            console.error("Error loading shifts", err);
        }
    };

    const handleGenerate = async () => {
        const payload = mode === 'TIME' ? { timeSlot: selectedTime } : { block: selectedBlock };

        try {
            const res = await axios.post('http://localhost:8080/api/shifts/generate', payload, {
                withCredentials: true
            });
            setCurrentShift(res.data);
            fetchGeneratedShifts();
            setRetries(prev => prev + 1);
        } catch (err) {
            console.error("Error generating shift", err);
        }
    };

    const handleAccept = async () => {
        if (!currentShift) return;
        try {
            await axios.post(`http://localhost:8080/api/shifts/${currentShift.id}/accept`, {}, {
                withCredentials: true
            });
            alert("Hệ thống đã chấp nhận ca trực!");
            fetchGeneratedShifts();
        } catch (err) {
            console.error("Error accepting shift", err);
        }
    };

    return (
        <div className="shift-generate-page">
            <div className="generate-box">
                <div className="input-section">
                    <div className="mode-toggle">
                        <label>
                            <input
                                type="radio"
                                value="TIME"
                                checked={mode === 'TIME'}
                                onChange={() => { setMode('TIME'); setSelectedBlock(''); }}
                            />
                            Chọn khung giờ
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="BLOCK"
                                checked={mode === 'BLOCK'}
                                onChange={() => { setMode('BLOCK'); setSelectedTime(''); }}
                            />
                            Chọn Block
                        </label>
                    </div>

                    {mode === 'TIME' ? (
                        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                            <option value="">-- Khung giờ --</option>
                            <option value="MORNING">07:30 - 11:30</option>
                            <option value="AFTERNOON">11:30 - 15:30</option>
                            <option value="EVENING">15:30 - 19:30</option>
                        </select>
                    ) : (
                        <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)}>
                            <option value="">-- Block --</option>
                            <option value="BLOCK1">Block 3</option>
                            <option value="BLOCK2">Block 4</option>
                            <option value="BLOCK3">Block 5</option>
                            <option value="BLOCK4">Block 6</option>
                            <option value="BLOCK5">Block 8</option>
                            <option value="BLOCK6">Block 10</option>
                            <option value="BLOCK8">Block 11</option>
                        </select>
                    )}
                </div>
                <button onClick={handleGenerate} disabled={retries >= 3 || (mode === 'TIME' && !selectedTime) || (mode === 'BLOCK' && !selectedBlock)}>
                    Tạo Ca Trực
                </button>
                {currentShift && (
                    <div className="current-shift-box">
                        <p><strong>Ca:</strong> {currentShift.timeSlot}</p>
                        <p><strong>Block:</strong> {currentShift.block}</p>
                        <p><strong>Ngày:</strong> {currentShift.shiftDate}</p>
                        <button onClick={handleAccept}>Chấp Nhật</button>
                    </div>
                )}
            </div>

            <div className="previous-shifts">
                <h3>Danh Sách Ca Trực Đã Tạo</h3>
                {shifts.map((shift, idx) => (
                    <div key={idx} className="shift-box">
                        <p>{shift.timeSlot} - {shift.block}
                            {shift.isAccepted ? (
                                <i className="fa-solid fa-check" style={{ color: 'green', marginLeft: '10px' }}></i>
                            ) : (
                                <i className="fa-solid fa-xmark" style={{ color: 'red', marginLeft: '10px' }}></i>
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftGenerate;