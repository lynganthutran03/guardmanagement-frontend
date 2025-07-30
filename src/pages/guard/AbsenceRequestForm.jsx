import React, { useState, useContext, useEffect } from 'react';
import { TitleContext } from '../../context/TitleContext';
import './AbsenceRequestForm.css'; // optional styling

const AbsenceRequestForm = () => {
    const { setTitle } = useContext(TitleContext);
    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState('');
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setTitle('Yêu Cầu Nghỉ Phép');
    }, [setTitle]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here you'd send to backend later
        console.log({
            startDate,
            days,
            reason
        });

        setSubmitted(true);
    };

    const today = new Date().toISOString().split('T')[0];
    const isFormValid = startDate && days && reason.trim();

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
                    Gửi Yêu Cầu
                </button>

                {submitted && (
                    <p className="success-message">
                        ✅ Yêu cầu của bạn đã được gửi (chưa kết nối backend).
                    </p>
                )}
            </form>
        </div>
    );
};

export default AbsenceRequestForm;
