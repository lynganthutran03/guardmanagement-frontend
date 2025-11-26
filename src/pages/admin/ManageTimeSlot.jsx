import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ManageTimeSlot.css';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const ManageTimeSlot = () => {
    const { setTitle } = useContext(TitleContext);
    const [timeSlots, setTimeSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        endTime: ''
    });

    useEffect(() => {
        setTitle('Quản Lý Ca Trực (Admin)');
        fetchTimeSlots();
    }, [setTitle]);

    const fetchTimeSlots = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/admin/timeslots");
            setTimeSlots(res.data || []);
        } catch (err) {
            toast.error("Lỗi tải danh sách ca trực.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                startTime: formData.startTime + ":00",
                endTime: formData.endTime + ":00"
            };
            await axios.post("/api/admin/timeslots", payload);
            toast.success("Đã thêm ca trực mới!");
            setFormData({ name: '', startTime: '', endTime: '' });
            fetchTimeSlots();
        } catch (err) {
            toast.error("Lỗi khi tạo ca trực.");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Xóa ca trực này có thể ảnh hưởng đến lịch sử. Bạn chắc chứ?")) return;
        try {
            await axios.delete(`/api/admin/timeslots/${id}`);
            toast.success("Đã xóa.");
            fetchTimeSlots();
        } catch (err) {
            toast.error("Không thể xóa (có thể đang được sử dụng).");
        }
    };

    return (
        <div className="admin-page-layout">
            <div className="admin-form-container">
                <h3>Thêm Ca Trực</h3>
                <form onSubmit={handleCreate}>
                    <div className="admin-form-group">
                        <label>Tên Ca (ví dụ: CA_SANG)</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Giờ Bắt Đầu</label>
                        <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Giờ Kết Thúc</label>
                        <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
                    </div>
                    <button type="submit" className="admin-submit-btn">Thêm Mới</button>
                </form>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header" style={{gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr'}}>
                    <span>ID</span><span>Tên</span><span>Bắt đầu</span><span>Kết thúc</span><span>Hành động</span>
                </div>
                {timeSlots.map(ts => (
                    <div key={ts.id} className="admin-list-row" style={{gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr'}}>
                        <span>{ts.id}</span>
                        <span>{ts.name}</span>
                        <span>{ts.startTime}</span>
                        <span>{ts.endTime}</span>
                        <span>
                            <button className="delete-btn" onClick={() => handleDelete(ts.id)}><i className="fa-solid fa-trash"></i></button>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageTimeSlot;