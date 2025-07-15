import React from 'react';
import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ShiftGenerate.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            setRetries(res.data.length);
        } catch (err) {
            console.error("Error loading generated shifts", err);
            const status = err.response?.status;
            if (status && status !== 404) {
                toast.error("Không thể tải danh sách ca trực. Vui lòng thử lại sau.");
            }
            setShifts([]);
            setRetries(0);
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
            const message = err.response?.data?.message || "Có lỗi xảy ra khi tạo ca trực. Vui lòng thử lại sau.";
            toast.error(message);
        }
    };

    const handleAccept = async () => {
        if (!currentShift) return;
        try {
            await axios.post(`http://localhost:8080/api/shifts/${currentShift.id}/accept`, {}, {
                withCredentials: true
            });
            toast.success("Hệ thống đã chấp nhận ca trực!");
            setShifts([]);
            setCurrentShift(null);
        } catch (err) {
            console.error("Error accepting shift", err);
            toast.error("Có lỗi xảy ra khi chấp nhận ca trực. Vui lòng thử lại sau.");
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
                            <option value="BLOCK_3">Block 3</option>
                            <option value="BLOCK_4">Block 4</option>
                            <option value="BLOCK_5">Block 5</option>
                            <option value="BLOCK_6">Block 6</option>
                            <option value="BLOCK_8">Block 8</option>
                            <option value="BLOCK_10">Block 10</option>
                            <option value="BLOCK_11">Block 11</option>
                        </select>
                    )}
                </div>
                <button onClick={handleGenerate}
                        disabled={retries >= 3 || (mode === 'TIME' && !selectedTime) || (mode === 'BLOCK' && !selectedBlock)}>
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
                    <div key={idx}
                        className={`shift-box ${currentShift?.id === shift.id ? 'selected' : ''}`}
                        onClick={() => setCurrentShift(shift)}
                        style={{ cursor: 'pointer' }}>
                        <p>{shift.timeSlot} - {shift.block}</p>
                    </div>
                ))}
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ShiftGenerate;