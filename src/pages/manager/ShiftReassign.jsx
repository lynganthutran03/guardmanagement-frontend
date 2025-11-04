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

    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const [selectedGuardId, setSelectedGuardId] = useState('');

    const [isLoadingRequests, setIsLoadingRequests] = useState(true);
    const [isLoadingShifts, setIsLoadingShifts] = useState(false);
    const [isLoadingGuards, setIsLoadingGuards] = useState(false);

    useEffect(() => {
        setTitle('Phân Công Ca Trực Bù');
        fetchApprovedRequests();
    }, [setTitle]);

    const fetchApprovedRequests = async () => {
        setIsLoadingRequests(true);
        try {
            const res = await axios.get("/api/leave-requests/approved");
            const futureRequests = (res.data || []).filter(req => 
                parseISO(req.endDate).getTime() >= new Date().setHours(0, 0, 0, 0)
            );
            setApprovedRequests(futureRequests);
        } catch (err) {
            toast.error("Không thể tải danh sách đơn nghỉ phép.");
        } finally {
            setIsLoadingRequests(false);
        }
    };

    const handleLeaveRequestSelect = async (leaveId) => {
        setSelectedShift(null);
        setSelectedGuardId('');
        setShiftsToReassign([]);
        setAvailableGuards([]);

        if (!leaveId) {
            setSelectedLeaveRequest(null);
            return;
        }

        const request = approvedRequests.find(r => r.id.toString() === leaveId);
        setSelectedLeaveRequest(request);
        setIsLoadingShifts(true);
        
        try {
            const res = await axios.get("/api/manager/shifts/by-guard", {
                params: {
                    guardId: request.guardId,
                    startDate: request.startDate,
                    endDate: request.endDate
                }
            });
            const unassignedShifts = (res.data || []).filter(
                shift => shift.guardId === request.guardId
            );
            setShiftsToReassign(unassignedShifts);
        } catch (err) {
            toast.error("Không thể tải ca trực của bảo vệ này.");
        } finally {
            setIsLoadingShifts(false);
        }
    };

    const handleShiftSelect = async (shiftId) => {
        setSelectedGuardId('');
        setAvailableGuards([]);

        if (!shiftId) {
            setSelectedShift(null);
            return;
        }
        
        const shift = shiftsToReassign.find(s => s.id.toString() === shiftId);
        setSelectedShift(shift);
        setIsLoadingGuards(true);
        
        try {
            const res = await axios.get(`/api/manager/guards/available?date=${shift.shiftDate}`);
            setAvailableGuards(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Không thể tải danh sách bảo vệ rảnh.");
        } finally {
            setIsLoadingGuards(false);
        }
    };

    const handleAssignShift = async () => {
        if (!selectedShift || !selectedGuardId) {
            toast.warn("Vui lòng chọn ca cần bù và bảo vệ thay thế.");
            return;
        }

        try {
            const payload = {
                shiftId: selectedShift.id,
                guardId: parseInt(selectedGuardId)
            };

            await axios.post("/api/manager/shifts/assign", payload);
            toast.success("Đã phân công ca trực thành công!");

            setSelectedLeaveRequest(null);
            setSelectedShift(null);
            setSelectedGuardId('');
            setShiftsToReassign([]);
            setAvailableGuards([]);
            fetchApprovedRequests();

        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi phân công ca trực.";
            toast.error(message);
        }
    };

    return (
        <div className="reassign-container-new">
            <div className={`step-card ${selectedLeaveRequest ? 'step-done' : 'step-active'}`}>
                <h4><span className="step-number">1</span> Chọn Đơn Nghỉ Phép</h4>
                {isLoadingRequests ? (
                    <p>Đang tải đơn nghỉ phép...</p>
                ) : (
                    <select
                        value={selectedLeaveRequest?.id || ''}
                        onChange={(e) => handleLeaveRequestSelect(e.target.value)}
                        className="form-select"
                    >
                        <option value="">-- Chọn đơn nghỉ đã duyệt --</option>
                        {approvedRequests.map(req => (
                            <option key={req.id} value={req.id}>
                                {req.guardName} (Nghỉ từ {parseISO(req.startDate).toLocaleDateString('vi-VN')} 
                                {" "}đến {parseISO(req.endDate).toLocaleDateString('vi-VN')})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {selectedLeaveRequest && (
                <div className={`step-card ${selectedShift ? 'step-done' : 'step-active'}`}>
                    <h4><span className="step-number">2</span> Chọn Ca Cần Bù (của {selectedLeaveRequest.guardName})</h4>
                    {isLoadingShifts ? (
                        <p>Đang tải ca trực...</p>
                    ) : shiftsToReassign.length > 0 ? (
                        <div className="shift-radio-group">
                            {shiftsToReassign.map(shift => (
                                <label 
                                    key={shift.id} 
                                    className={`shift-radio-label ${selectedShift?.id === shift.id ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="shiftToReassign"
                                        value={shift.id}
                                        checked={selectedShift?.id === shift.id}
                                        onChange={(e) => handleShiftSelect(e.target.value)}
                                    />
                                    <div className="shift-radio-content">
                                        <strong>{parseISO(shift.shiftDate).toLocaleDateString('vi-VN')}</strong>
                                        <span>{timeSlotMap[shift.timeSlot] || shift.timeSlot}</span>
                                        <span>Tại {locationMap[shift.location] || shift.location}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">Không tìm thấy ca trực nào cần bù cho đơn nghỉ này.</p>
                    )}
                </div>
            )}

            {selectedShift && (
                <div className="step-card step-active">
                    <h4><span className="step-number">3</span> Chọn Bảo Vệ Thay Thế</h4>
                    <label>Bảo vệ rảnh vào ngày {parseISO(selectedShift.shiftDate).toLocaleDateString('vi-VN')}:</label>
                    {isLoadingGuards ? (
                        <p>Đang tải danh sách bảo vệ...</p>
                    ) : availableGuards.length > 0 ? (
                        <select
                            value={selectedGuardId}
                            onChange={(e) => setSelectedGuardId(e.target.value)}
                            className="form-select"
                        >
                            <option value="">-- Chọn bảo vệ thay thế --</option>
                            {availableGuards.map(guard => (
                                <option key={guard.id} value={guard.id}>
                                    {guard.fullName} (ID: {guard.identityNumber}, Đội: {guard.team})
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-muted">Không tìm thấy bảo vệ nào rảnh vào ngày này.</p>
                    )}
                    
                    <div className="swap-actions">
                        <button 
                            className="confirm-btn" 
                            onClick={handleAssignShift}
                            disabled={!selectedGuardId || isLoadingShifts || isLoadingGuards}
                        >
                            Xác Nhận Phân Công
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftReassign;