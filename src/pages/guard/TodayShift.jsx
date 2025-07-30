import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import { toast } from 'react-toastify';
import './TodayShift.css';

const TodayShift = ({ }) => {
    const { setTitle } = useContext(TitleContext);
    const [acceptedShift, setAcceptedShift] = useState(null);

    useEffect(() => {
        setTitle('Lịch Trực Hôm Nay');
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
    }, [setTitle]);

    return (
        <div className="shift-box">
            <h4>Ca trực của bạn hôm nay:</h4>
            {acceptedShift ? (
                <div className="shift-info">
                    <p><strong>Ngày:</strong> {acceptedShift.shiftDate}</p>
                    <p><strong>Ca trực:</strong> {acceptedShift.timeSlot}</p>
                    <p><strong>Khu vực:</strong> {acceptedShift.block}</p>
                </div>
            ) : (
                <p>Bạn chưa có ca trực nào được chấp nhận hôm nay.</p>
            )}
        </div>
    );
};

export default TodayShift;