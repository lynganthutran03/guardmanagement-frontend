import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import { toast } from 'react-toastify';
import './TodayShift.css';

const timeSlotMap = {
    DAY_SHIFT: "07:30 - 14:30",
    NIGHT_SHIFT: "14:30 - 21:30"
};

const locationMap = {
    BLOCK_3: "Block 3",
    BLOCK_4: "Block 4",
    BLOCK_5: "Block 5",
    BLOCK_6: "Block 6",
    BLOCK_8: "Block 8",
    BLOCK_10: "Block 10",
    BLOCK_11: "Block 11",

    GATE_1: "Gate 1",
    GATE_2: "Gate 2",
    GATE_3: "Gate 3"
};

const TodayShift = () => {
    const { setTitle } = useContext(TitleContext);
    const [acceptedShift, setAcceptedShift] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    const fetchShift = (date) => {
        const url = date
            ? `/api/shifts?date=${date}`
            : "/api/shifts/accepted-today";

        axios.get(url, { withCredentials: true })
            .then(res => {
                const shiftData = Array.isArray(res.data) ? res.data[0] : res.data; 
                
                if (shiftData && shiftData.shiftDate) {
                    setAcceptedShift({
                        shiftDate: shiftData.shiftDate,
                        timeSlot: timeSlotMap[shiftData.timeSlot] || shiftData.timeSlot,
                        location: locationMap[shiftData.location] || shiftData.location 
                    });
                } else {
                    setAcceptedShift(null);
                }
            })
            .catch(err => {
                if (err.response?.status === 404) {
                    setAcceptedShift(null);
                } else {
                    toast.error("Lỗi khi tải ca trực.");
                }
            });
    };

    useEffect(() => {
        setTitle('Lịch Trực');
        fetchShift(selectedDate || new Date().toISOString().split('T')[0]); 
    }, [setTitle]);

    useEffect(() => {
        fetchShift(selectedDate);
    }, [selectedDate]);


    return (
        <div className="shift-container">
            <div className="shift-header">
                <div className="date-picker">
                    <label>Chọn ngày:</label>
                    <input
                        type="date"
                        value={selectedDate || new Date().toISOString().split('T')[0]} // Default to today
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                {acceptedShift ? ( // Show info only if a shift exists
                    <div className="shift-info">
                        Ca trực: <strong>{acceptedShift.timeSlot}</strong>
                    </div>
                ) : (
                    <div className="shift-info">
                        <strong>Không có ca trực vào ngày này.</strong>
                    </div>
                )}
            </div>

            <div className="tower-grid">
                {Object.keys(locationMap).map((locationKey) => {
                    const locationName = locationMap[locationKey];
                    const isActive = acceptedShift && acceptedShift.location === locationName;

                    return (
                        <div key={locationKey} className={`tower ${isActive ? "active" : ""}`}>
                            <i className="fas fa-building tower-icon"></i>
                            <span className="tower-label">{locationName}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TodayShift;