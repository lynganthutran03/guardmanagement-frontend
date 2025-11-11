import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './LeaveRequestCheck.css';
import { toast } from 'react-toastify';
import { differenceInDays, parseISO, addDays } from 'date-fns';

axios.defaults.withCredentials = true;

const LeaveRequestCheck = ({ setNotificationCount }) => {
    const { setTitle } = useContext(TitleContext);

    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingRequests = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/leave-requests/pending");
            setPendingRequests(res.data);
            setNotificationCount(res.data.length);
        } catch (err) {
            toast.error("Không thể tải danh sách đơn nghỉ phép.");
            setNotificationCount(0);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        setTitle('Duyệt Nghỉ Phép');
        fetchPendingRequests();
    }, [setTitle, setNotificationCount]);

    const handleApprove = async (id) => {
        try {
            await axios.post(`/api/leave-requests/approve/${id}`);
            toast.success("Đã duyệt đơn nghỉ phép!");
            setPendingRequests(prevRequests => 
                prevRequests.filter(req => req.id !== id)
            );
            setNotificationCount(prevCount => prevCount - 1);
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi duyệt đơn.";
            toast.error(message);
        }
    };

    const handleDeny = async (id) => {
        try {
            await axios.post(`/api/leave-requests/deny/${id}`);
            toast.info("Đã từ chối đơn nghỉ phép.");
            setPendingRequests(prevRequests => 
                prevRequests.filter(req => req.id !== id)
            );
            setNotificationCount(prevCount => prevCount - 1);
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi từ chối đơn.";
            toast.error(message);
        }
    };

    const calculateDaysOff = (startDate, endDate) => {
        try {
            const start = parseISO(startDate);
            const end = parseISO(endDate);
            return differenceInDays(end, start) + 1;
        } catch (e) {
            return '?';
        }
    };

    const calculateReturnDate = (endDate) => {
        try {
            const end = parseISO(endDate);
            const returnDate = addDays(end, 1);
            return returnDate.toLocaleDateString('vi-VN');
        } catch (e) {
            return 'N/A';
        }
    };

    if (isLoading) {
    }

    return (
        <div className="leave-grid-container">
            {pendingRequests.length > 0 ? (
                pendingRequests.map(req => {
                    const daysOff = calculateDaysOff(req.startDate, req.endDate);
                    const returnDate = calculateReturnDate(req.endDate);

                    return (
                        <div key={req.id} className="leave-card">
                            <p><strong>Bảo vệ:</strong> {req.guardName || 'N/A'} (ID: {req.guardId})</p>
                            <p><strong>Ngày bắt đầu:</strong> {parseISO(req.startDate).toLocaleDateString('vi-VN')}</p>
                            <p><strong>Số ngày nghỉ:</strong> {daysOff} ngày</p>
                            <p><strong>Ngày đi làm lại:</strong> {returnDate}</p>
                            <p><strong>Lý do:</strong> {req.reason}</p>
                            <div className="button-group">
                                <button className="accept" onClick={() => handleApprove(req.id)}>
                                    Đồng ý
                                </button>
                                <button className="reject" onClick={() => handleDeny(req.id)}>
                                    Không đồng ý
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>Không có đơn nghỉ phép nào đang chờ duyệt.</p>
            )}
        </div>
    );
};

export default LeaveRequestCheck;