import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './MyShifts.css';

const MyShifts = () => {
    const { setTitle } = useContext(TitleContext);
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        setTitle('Ca Trực Của Tôi');
        axios.get('http://localhost:8080/api/shifts/history', {
            withCredentials: true
        })
            .then(res => {
                setShifts(res.data);
            })
            .catch(() => {
                setShifts([]);
            });
    }, [setTitle]);

    return (
        <div className="my-shifts-page">
            <h2>Lịch Sử Ca Trực</h2>
            <table className="shift-history-table">
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Ca trực</th>
                        <th>Khu vực</th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.length === 0 ? (
                        <tr>
                            <td colSpan="3">Không có ca trực nào trong quá khứ.</td>
                        </tr>
                    ) : (
                        shifts.map(shift => (
                            <tr key={shift.id}>
                                <td>{shift.shiftDate}</td>
                                <td>{shift.timeSlot}</td>
                                <td>{shift.block}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyShifts;