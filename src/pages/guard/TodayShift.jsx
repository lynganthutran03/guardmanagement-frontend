import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import { toast } from 'react-toastify';
import './TodayShift.css';

// Temporary mock shifts for testing date selection
const mockShifts = [
    { shiftDate: '2025-08-09', timeSlot: '07:30 - 11:30', block: 'Block 3' },
    { shiftDate: '2025-08-10', timeSlot: '11:30 - 15:30', block: 'Block 5' },
    { shiftDate: '2025-08-11', timeSlot: '15:30 - 19:30', block: 'Block 8' }
];

const TodayShift = () => {
    const { setTitle } = useContext(TitleContext);
    const [acceptedShift, setAcceptedShift] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        setTitle('Lịch Trực Hôm Nay');

        // Only call backend if no date is chosen (default behaviour)
        if (!selectedDate) {
            axios.get("http://localhost:8080/api/shifts/accepted-today", { withCredentials: true })
                .then(res => setAcceptedShift(res.data))
                .catch(err => {
                    if (err.response?.status === 404) {
                        console.log("No shift today.");
                        setAcceptedShift(null);
                    } else {
                        toast.error("Lỗi khi tải ca trực hôm nay.");
                    }
                });
        }
    }, [setTitle, selectedDate]);

    // Handle date selection for mock mode
    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);

        if (date) {
            const foundShift = mockShifts.find(shift => shift.shiftDate === date);
            setAcceptedShift(foundShift || null);
        } else {
            setAcceptedShift(null);
        }
    };

    return (
        <div className="shift-container">
            <div className="shift-card">
                <div className="shift-header">
                    <h4>Ca trực của bạn</h4>
                    <div className="date-picker">
                        <label>Chọn ngày:</label>
                        <input type="date" value={selectedDate} onChange={handleDateChange} />
                    </div>
                </div>

                {acceptedShift ? (
                    <div className="shift-details">
                        <div className="shift-detail">
                            <i className="fas fa-calendar-day"></i>
                            <span><strong>Ngày:</strong> {acceptedShift.shiftDate}</span>
                        </div>
                        <div className="shift-detail">
                            <i className="fas fa-clock"></i>
                            <span><strong>Ca trực:</strong> {acceptedShift.timeSlot}</span>
                        </div>
                        <div className="shift-detail">
                            <i className="fas fa-map-marker-alt"></i>
                            <span><strong>Khu vực:</strong> {acceptedShift.block}</span>
                        </div>
                    </div>
                ) : (
                    <div className="no-shift">
                        <i className="fas fa-bed"></i>
                        <p>Không có ca trực cho ngày này.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodayShift;
