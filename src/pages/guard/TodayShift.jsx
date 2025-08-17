import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import { toast } from 'react-toastify';
import './TodayShift.css';

const timeSlotMap = {
    MORNING: "07:30 - 11:30",
    AFTERNOON: "11:30 - 15:30",
    EVENING: "15:30 - 19:30"
};

const blockMap = {
    BLOCK_3: "Block 3",
    BLOCK_4: "Block 4",
    BLOCK_5: "Block 5",
    BLOCK_6: "Block 6",
    BLOCK_8: "Block 8",
    BLOCK_10: "Block 10",
    BLOCK_11: "Block 11"
};

const TodayShift = () => {
    const { setTitle } = useContext(TitleContext);
    const [acceptedShift, setAcceptedShift] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

    const fetchShift = (date) => {
        const url = date
            ? `http://localhost:8080/api/shifts?date=${date}`
            : "http://localhost:8080/api/shifts/accepted-today";

        axios.get(url, { withCredentials: true })
            .then(res => {
                const shiftData = Array.isArray(res.data) ? res.data[0] : res.data;
                if (shiftData) {
                    setAcceptedShift({
                        shiftDate: shiftData.shiftDate,
                        timeSlot: timeSlotMap[shiftData.timeSlot] || shiftData.timeSlot,
                        block: blockMap[shiftData.block] || shiftData.block
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
        fetchShift(selectedDate);
    }, [setTitle, selectedDate]);

    return (
        <div className="shift-container">
            <div className="shift-header">
                <div className="date-picker">
                    <label>Chọn ngày:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                {acceptedShift && (
                    <div className="shift-info">
                        Ca trực: <strong>{acceptedShift.timeSlot}</strong>
                    </div>
                )}
            </div>

            <div className="tower-grid">
                {Object.keys(blockMap).map((blockKey) => {
                    const blockName = blockMap[blockKey];
                    const isActive = acceptedShift?.block === blockName;

                    return (
                        <div key={blockKey} className={`tower ${isActive ? "active" : ""}`}>
                            <i className="fas fa-building tower-icon"></i>
                            <span className="tower-label">{blockName}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TodayShift;
