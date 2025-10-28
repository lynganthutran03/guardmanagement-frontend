import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ShiftGenerate.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

const ShiftGenerate = () => {
    const { setTitle } = useContext(TitleContext);
    const [guards, setGuards] = useState([]);
    
    const [selectedGuardId, setSelectedGuardId] = useState('');
    const [weekStartDate, setWeekStartDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTitle('Tạo Lịch Làm Việc Tuần');
    }, [setTitle]);

    useEffect(() => {
        axios.get("/api/guards") 
            .then(res => setGuards(res.data))
            .catch(() => toast.error("Không thể tải danh sách nhân viên."));
    }, []);

    const handleGenerateWeek = async () => {
        if (!selectedGuardId) {
            toast.error("Vui lòng chọn một bảo vệ.");
            return;
        }
        if (!weekStartDate) {
            toast.error("Vui lòng chọn ngày bắt đầu tuần.");
            return;
        }

        const selectedDate = new Date(weekStartDate + "T00:00:00");
        if (selectedDate.getDay() !== 1) { 
            toast.error("Ngày bắt đầu tuần phải là một ngày thứ Hai.");
            return;
        }

        setIsLoading(true);
        
        const payload = {
            guardId: selectedGuardId,
            weekStartDate: weekStartDate
        };

        try {
            const res = await axios.post('/api/manager/schedule/generate-week', payload);
            toast.success(res.data.message || "Tạo lịch tuần thành công!");
            
            setSelectedGuardId('');
            setWeekStartDate('');
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi tạo lịch tuần.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="shift-generate-page">
            <div className="generate-box">
                <div className="input-section">
                    
                    {/* --- GUARD SELECTION --- */}
                    <label>1. Chọn bảo vệ:</label>
                    <select value={selectedGuardId} onChange={(e) => setSelectedGuardId(e.target.value)} required>
                        <option value="">-- Chọn bảo vệ --</option>
                        {guards.map(guard => (
                            <option key={guard.id} value={guard.id}>
                                {guard.fullName} (Team: {guard.team || 'N/A'}, Gr: {guard.rotaGroup || 'N/A'})
                            </option>
                        ))}
                    </select>

                    {/* --- WEEK START DATE SELECTION --- */}
                    <label>2. Chọn ngày bắt đầu tuần (Thứ Hai):</label>
                    <input
                        type="date"
                        value={weekStartDate}
                        onChange={(e) => setWeekStartDate(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleGenerateWeek}
                    disabled={isLoading || !selectedGuardId || !weekStartDate}
                >
                    {isLoading ? "Đang tạo..." : "Tạo Lịch 7 Ngày"}
                </button>
            </div>
            
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ShiftGenerate;