import { React, useEffect, useContext, useState } from 'react';
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
    const [mode, setMode] = useState('TIME');
    const [employeeId, setEmployeeId] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        setTitle('Tạo Lịch Làm Việc');
    }, [setTitle]);

    useEffect(() => {
        if (employeeId) fetchGeneratedShifts();
    }, [selectedDate, employeeId]);

    useEffect(() => {
        setCurrentShift(null);
    }, [selectedDate, employeeId]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/employees")
            .then(res => setEmployees(res.data))
            .catch(() => toast.error("Không thể tải danh sách nhân viên."));
    }, []);

    const handleGenerate = async () => {
        const payload = {
            employeeId,
            shiftDate: selectedDate,
            ...(mode === 'TIME'
                ? { timeSlot: selectedTime }
                : { block: selectedBlock })
        };

        try {
            const res = await axios.post('http://localhost:8080/api/manager/shifts', payload);
            res.data.employeeId = employeeId;
            setCurrentShift({ ...res.data, employeeId });
            fetchGeneratedShifts();
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi tạo ca trực.";
            toast.error(message);
        }
    };

    const fetchGeneratedShifts = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/manager/shifts?date=${selectedDate}&employeeId=${employeeId}`);
            setShifts(res.data);
        } catch (err) {
            console.error("Error loading shifts", err);
            setShifts([]);
            toast.error("Không thể tải ca trực.");
        }
    };

    const hasShiftForDate = (date) => {
        const existsInFetched = shifts.some(
            shift => shift.shiftDate === date && shift.employeeId === employeeId
        );
        const isInCurrent = currentShift &&
            currentShift.shiftDate === date &&
            currentShift.employeeId === employeeId;

        return existsInFetched || isInCurrent;
    };

    return (
        <div className="shift-generate-page">
            <div className="generate-box">
                <div className="input-section">
                    <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required>
                        <option value="">-- Chọn bảo vệ --</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.fullName} - {emp.identityNumber}
                            </option>
                        ))}
                    </select>

                    <div className="mode-toggle">
                        <label className="date-label">
                            Chọn ngày:&nbsp;
                            <input
                                type="date"
                                value={selectedDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </label>

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

                <button
                    onClick={handleGenerate}
                    disabled={
                        !employeeId ||
                        !selectedDate ||
                        (mode === 'TIME' && !selectedTime) ||
                        (mode === 'BLOCK' && !selectedBlock) ||
                        hasShiftForDate(selectedDate)
                    }>
                    Tạo Ca Trực
                </button>

                {currentShift && (
                    <>
                        <div className="current-shift-box">
                            <p><strong>Ngày:</strong> {currentShift.shiftDate}</p>
                            <p><strong>Ca:</strong> {currentShift.timeSlot}</p>
                            <p><strong>Block:</strong> {currentShift.block}</p>
                        </div>
                        <button
                            className="accept-button"
                            onClick={async () => {
                                try {
                                    await axios.patch(`http://localhost:8080/api/manager/shifts/${currentShift.id}/assign`, {
                                        employeeId
                                    });
                                    toast.success("Đã gửi ca trực cho bảo vệ!");
                                    setCurrentShift(null);
                                    fetchGeneratedShifts();
                                } catch {
                                    toast.error("Lỗi khi gửi ca trực.");
                                }
                            }}
                            disabled={!currentShift || hasShiftForDate(selectedDate) || currentShift.employeeId}
                        >
                            Chấp Nhận
                        </button>
                    </>

                )}
            </div>

            {shifts.length > 0 && (
                <div className="previous-shifts">
                    <h3>Ca Trực Đã Tạo Cho Nhân Viên</h3>
                    {shifts.map((shift, idx) => (
                        <div key={idx}
                            className={`shift-box ${currentShift?.id === shift.id ? 'selected' : ''}`}
                            onClick={() => setCurrentShift(shift)}
                            style={{ cursor: 'pointer' }}>
                            <p>{shift.shiftDate} - {shift.timeSlot} - {shift.block}</p>
                        </div>
                    ))}
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ShiftGenerate;
