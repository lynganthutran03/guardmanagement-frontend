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
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [hasAccepted, setHasAccepted] = useState(false);

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
        axios.get("/api/employees")
            .then(res => setEmployees(res.data))
            .catch(() => toast.error("Không thể tải danh sách nhân viên."));
    }, []);

    const hasAssignedToday = shifts.some(s => s.employeeId);

    const handleGenerate = async () => {
        if (shifts.length >= 3) {
            toast.info("Đã tạo tối đa 3 ca trực.");
            return;
        }

        const payload = {
            shiftDate: selectedDate,
            ...(mode === 'TIME' ? { timeSlot: selectedTime } : { location: selectedLocation })
        };

        try {
            const res = await axios.post('/api/manager/shifts', payload);
            setShifts(prev => [...prev, res.data]);
            setCurrentShift(res.data);
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi tạo ca trực.";
            toast.error(message);
        }
    };


    const fetchGeneratedShifts = async () => {
        try {
            const res = await axios.get(`/api/manager/shifts?date=${selectedDate}&employeeId=${employeeId}`);
            setShifts(res.data);
        } catch (err) {
            console.error("Error loading shifts", err);
            setShifts([]);
            toast.error("Không thể tải ca trực.");
        }
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
                                onChange={() => { setMode('TIME'); setSelectedLocation(''); }}
                            />
                            Chọn khung giờ
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="LOCATION"
                                checked={mode === 'LOCATION'}
                                onChange={() => { setMode('LOCATION'); setSelectedTime(''); }}
                            />
                            Chọn địa điểm
                        </label>
                    </div>

                    {mode === 'TIME' ? (
                        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                            <option value="">-- Khung giờ --</option>
                            <option value="DAY_SHIFT">07:30 - 14:30</option>
                            <option value="NIGHT_SHIFT">14:30 - 21:30</option>
                        </select>
                    ) : (
                        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                            <option value="">-- Khu vực --</option>
                            <option value="BLOCK_3">Block 3</option>
                            <option value="BLOCK_4">Block 4</option>
                            <option value="BLOCK_5">Block 5</option>
                            <option value="BLOCK_6">Block 6</option>
                            <option value="BLOCK_8">Block 8</option>
                            <option value="BLOCK_10">Block 10</option>
                            <option value="BLOCK_11">Block 11</option>

                            <option value="GATE_1">Gate 1</option>
                            <option value="GATE_2">Gate 2</option>
                            <option value="GATE_3">Gate 3</option>
                        </select>
                    )}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={
                        !employeeId ||
                        !selectedDate ||
                        (mode === 'TIME' && !selectedTime) ||
                        (mode === 'LOCATION' && !selectedLocation) ||
                        shifts.length >= 3 ||
                        hasAssignedToday
                    }>
                    Tạo Ca Trực
                </button>

                {currentShift && (
                    <>
                        <div className="current-shift-box">
                            <p><strong>Ngày:</strong> {currentShift.shiftDate}</p>
                            <p><strong>Ca:</strong> {currentShift.timeSlot}</p>
                            <p><strong>Khu vực:</strong> {currentShift.location}</p>
                        </div>
                        <button
                            className="accept-button"
                            onClick={async () => {
                                try {
                                    await axios.post("/api/manager/shifts/assign", {
                                        shiftId: currentShift.id,
                                        employeeId
                                    });

                                    toast.success("Đã gửi ca trực cho bảo vệ!");
                                    await fetchGeneratedShifts();
                                    setCurrentShift(null);
                                } catch {
                                    toast.error("Lỗi khi gửi ca trực.");
                                }
                            }}
                            disabled={!currentShift || hasAssignedToday}
                        >
                            Chấp Nhận
                        </button>
                    </>
                )}
            </div>

            <div className="previous-shifts">
                <h3>Ca Trực Đã Tạo Cho Nhân Viên</h3>
                {shifts.length > 0 ? (
                    shifts.map((shift, idx) => (
                        <div key={idx}
                            className={`shift-box ${currentShift?.id === shift.id ? 'selected' : ''}`}
                            onClick={() => setCurrentShift(shift)}
                            style={{ cursor: 'pointer' }}>
                            <p>{shift.shiftDate} - {shift.timeSlot} - {shift.location}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-shift-placeholder">Chưa có ca trực nào được tạo.</p>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ShiftGenerate;
