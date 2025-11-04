import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ShiftReassign.css';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';

axios.defaults.withCredentials = true;

const timeSlotMap = {
    DAY_SHIFT: "Ca Sáng (07:30 - 14:30)",
    NIGHT_SHIFT: "Ca Tối (14:30 - 21:30)"
};
const locationMap = {
    BLOCK_3: "Block 3", BLOCK_4: "Block 4", BLOCK_5: "Block 5",
    BLOCK_6: "Block 6", BLOCK_8: "Block 8", BLOCK_10: "Block 10",
    BLOCK_11: "Block 11", GATE_1: "Gate 1", GATE_2: "Gate 2", GATE_3: "Gate 3"
};

const ShiftReassign = () => {
    const { setTitle } = useContext(TitleContext);

    const [approvedRequests, setApprovedRequests] = useState([]);
    const [shiftsToReassign, setShiftsToReassign] = useState([]);
    const [availableGuards, setAvailableGuards] = useState([]);

    const [selectedLeaveRequestId, setSelectedLeaveRequestId] = useState('');
    const [selectedShiftId, setSelectedShiftId] = useState('');
    const [selectedGuardId, setSelectedGuardId] = useState('');

    const [isLoadingLeaveRequests, setIsLoadingLeaveRequests] = useState(true);
    const [isLoadingShifts, setIsLoadingShifts] = useState(false);
    const [isLoadingGuards, setIsLoadingGuards] = useState(false);

    useEffect(() => {
        setTitle('Phân Công Ca Trực Bù (Hoán Đổi)');
        fetchApprovedRequests();
    }, [setTitle]);

    const fetchApprovedRequests = async () => {
        setIsLoadingLeaveRequests(true);
        try {
            const res = await axios.get("/api/leave-requests/approved");
            setApprovedRequests(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Không thể tải danh sách đơn nghỉ phép.");
        } finally {
            setIsLoadingLeaveRequests(false);
        }
    };

    const handleLeaveRequestSelect = async (leaveId) => {
        setSelectedLeaveRequestId(leaveId);
        setSelectedShiftId('');
        setSelectedGuardId('');
        setShiftsToReassign([]);
        setAvailableGuards([]);

        if (!leaveId) return;

        setIsLoadingShifts(true);
        try {
            const selectedRequest = approvedRequests.find(r => r.id.toString() === leaveId);
            if (!selectedRequest) return;

            const res = await axios.get("/api/manager/shifts/by-guard", {
                params: {
                    guardId: selectedRequest.guardId,
                    startDate: selectedRequest.startDate,
                    endDate: selectedRequest.endDate
                }
            });
            setShiftsToReassign(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Không thể tải ca trực của bảo vệ này.");
        } finally {
            setIsLoadingShifts(false);
        }
    };

    const handleShiftSelect = async (shiftId) => {
        setSelectedShiftId(shiftId);
        setSelectedGuardId('');
        setAvailableGuards([]);

        if (!shiftId) return;

        setIsLoadingGuards(true);
        try {
            const selectedShift = shiftsToReassign.find(s => s.id.toString() === shiftId);
            if (!selectedShift) return;

            const res = await axios.get(`/api/manager/guards/available?date=${selectedShift.shiftDate}`);
            setAvailableGuards(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Không thể tải danh sách bảo vệ rảnh.");
        } finally {
            setIsLoadingGuards(false);
        }
    };

    const handleAssignShift = async () => {
        if (!selectedShiftId || !selectedGuardId) {
            toast.warn("Vui lòng chọn ca cần bù và bảo vệ thay thế.");
            return;
        }

        try {
            const payload = {
                shiftId: parseInt(selectedShiftId),
                guardId: parseInt(selectedGuardId)
            };

            await axios.post("/api/manager/shifts/assign", payload);
            toast.success("Đã phân công ca trực thành công!");

            setSelectedLeaveRequestId('');
            setSelectedShiftId('');
            setSelectedGuardId('');
            setShiftsToReassign([]);
            setAvailableGuards([]);
            await fetchApprovedRequests();

        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi phân công ca trực.";
            toast.error(message);
        }
    };

    const formatShiftName = (shift) => {
        try {
            const date = parseISO(shift.shiftDate).toLocaleDateString('vi-VN');
            const time = timeSlotMap[shift.timeSlot] || shift.timeSlot || "N/A";
            const location = locationMap[shift.location] || shift.location || "N/A";
            return `${date} - (${time}) - tại ${location}`;
        } catch (e) { return `Ca ID: ${shift.id}`; }
    };

    return (
        <div className="reassign-container">
            <div className="shift-swap-panel">
                <div className="shift-card absent-card">
                    <h4>1. Chọn Bảo Vệ/Đơn Nghỉ Phép</h4>
                    <label>Đơn nghỉ phép đã duyệt (chưa xử lý ca):</label>
                    <select
                        value={selectedLeaveRequestId}
                        onChange={(e) => handleLeaveRequestSelect(e.target.value)}
                        disabled={isLoadingLeaveRequests}
                    >
                        <option value="">-- {isLoadingLeaveRequests ? "Đang tải..." : "Chọn đơn nghỉ"} --</option>
                        {approvedRequests.map(req => (
                            <option key={req.id} value={req.id}>
                                {req.guardName} (Nghỉ từ {parseISO(req.startDate).toLocaleDateString('vi-VN')})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="swap-icon">
                    <i className="fas fa-arrow-right"></i>
                </div>

                <div className="shift-card replacement-card">
                    <h4>2. Chọn Ca Cần Bù</h4>
                    <label>Ca trực của bảo vệ trong thời gian nghỉ:</label>
                    <select
                        value={selectedShiftId}
                        onChange={(e) => handleShiftSelect(e.target.value)}
                        disabled={!selectedLeaveRequestId || isLoadingShifts}
                    >
                        <option value="">-- {isLoadingShifts ? "Đang tải ca..." : "Chọn ca cần bù"} --</option>
                        {shiftsToReassign.map(shift => (
                            <option key={shift.id} value={shift.id}>
                                {formatShiftName(shift)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="shift-swap-panel" style={{ marginTop: '20px' }}>
                <div className="shift-card replacement-card" style={{ width: '100%' }}>
                    <h4>3. Chọn Bảo Vệ Thay Thế</h4>
                    <label>Bảo vệ rảnh vào ngày đã chọn:</label>
                    <select
                        value={selectedGuardId}
                        onChange={(e) => setSelectedGuardId(e.target.value)}
                        disabled={!selectedShiftId || isLoadingGuards}
                    >
                        <option value="">-- {isLoadingGuards ? "Đang tải..." : "Chọn bảo vệ thay thế"} --</option>
                        {availableGuards.map(guard => (
                            <option key={guard.id} value={guard.id}>
                                {guard.fullName} (ID: {guard.identityNumber}, Đội: {guard.team})
                            </option>
                        ))}
                    </select>
                    {!isLoadingGuards && selectedShiftId && availableGuards.length === 0 && (
                        <p className="no-shift">Không tìm thấy bảo vệ nào rảnh vào ngày này.</p>
                    )}
                </div>
            </div>

            <div className="swap-actions">
                <button
                    className="confirm-btn"
                    onClick={handleAssignShift}
                    disabled={!selectedShiftId || !selectedGuardId}
                >
                    Xác Nhận Phân Công
                </button>
            </div>
        </div>
    );
};

export default ShiftReassign;