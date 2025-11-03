import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './AbsenceRequestForm.css';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const AbsenceRequestForm = () => {
    const { setTitle } = useContext(TitleContext);
    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState('');
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setTitle('Yêu Cầu Nghỉ Phép');
    }, [setTitle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            startDate: startDate,
            days: parseInt(days),
            reason: reason
        };

        try {
            await axios.post("/api/leave-requests/request", payload);
            
            toast.success("Đã gửi yêu cầu nghỉ phép thành công!");
            
            setStartDate('');
            setDays('');
            setReason('');
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi gửi yêu cầu.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const isFormValid = startDate && days && reason.trim() && !isLoading;

    return (
        <div className="absence-form-container">
            <h3>Đơn Xin Nghỉ Phép</h3>
            <form onSubmit={handleSubmit} className="absence-form">

                <label>Ngày bắt đầu:</label>
                <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />

                <label>Số ngày nghỉ:</label>
                <select
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    required
                >
                    <option value="">-- Chọn số ngày --</option>
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <option key={d} value={d}>{d} ngày</option>
                    ))}
                </select>

                <label>Lý do nghỉ:</label>
                <textarea
                    rows="4"
                    placeholder="Nhập lý do nghỉ phép..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />

                <button type="submit" disabled={!isFormValid}>
                    {isLoading ? "Đang gửi..." : "Gửi Yêu Cầu"}
                </button>

            </form>
        </div>
    );
};

export default AbsenceRequestForm;