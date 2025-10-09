import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './MyShifts.css';

const timeSlotMap = {
    DAY_SHIFT: "07:30 - 14:30",
    NIGHT_SHIFT: "14:30 - 21:30"
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

const MyShifts = () => {
    const { setTitle } = useContext(TitleContext);
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        setTitle('Lịch Sử Ca Trực');
        axios.get('http://localhost:8080/api/shifts/history', {
            withCredentials: true
        })
            .then(res => setShifts(res.data))
            .catch(() => setShifts([]));
    }, [setTitle]);

    return (
        <div className="shift-history-page">
            <div className="shift-history-table">
                <div className="shift-history-header">
                    <span>Ngày</span>
                    <span>Ca trực</span>
                    <span>Khu vực</span>
                </div>

                {shifts.length === 0 ? (
                    <div className="shift-history-row empty-row">
                        <span colSpan="3">Không có ca trực nào trong quá khứ.</span>
                    </div>
                ) : (
                    shifts.map(shift => (
                        <div key={shift.id} className="shift-history-row">
                            <span>{shift.shiftDate}</span>
                            <span>{timeSlotMap[shift.timeSlot] || shift.timeSlot}</span>
                            <span>{blockMap[shift.block] || shift.block}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyShifts;
