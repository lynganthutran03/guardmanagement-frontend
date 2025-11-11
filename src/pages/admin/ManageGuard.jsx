import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ManageGuard.css';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const AdminManageGuards = () => {
    const { setTitle } = useContext(TitleContext);
    const [guards, setGuards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        identityNumber: '',
        team: 'A',
        rotaGroup: 1
    });

    useEffect(() => {
        setTitle('Quản Lý Bảo Vệ (Admin)');
        fetchData();
    }, [setTitle]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const guardsRes = await axios.get("/api/admin/guards");
            setGuards(guardsRes.data || []);
        } catch (err) {
            toast.error("Không thể tải danh sách bảo vệ.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateGuard = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password || !formData.fullName || !formData.identityNumber) {
            toast.warn("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            await axios.post("/api/admin/guards", formData);
            toast.success(`Đã tạo bảo vệ "${formData.fullName}" thành công!`);
            setFormData({
                username: '', password: '', fullName: '', identityNumber: '',
                team: 'A', rotaGroup: 1
            });
            fetchData();
        } catch (err) {
            toast.error("Lỗi khi tạo bảo vệ: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteGuard = async (id) => {
        toast.warn("Chức năng xóa chưa được cài đặt!");
    };

    return (
        <div className="admin-page-layout">
            <div className="admin-form-container">
                <h3>Thêm Bảo Vệ Mới</h3>
                <form onSubmit={handleCreateGuard}>
                    <div className="admin-form-group">
                        <label>Tên đăng nhập (username)</label>
                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Họ và Tên (Full Name)</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Mã Nhân viên (Identity Number)</label>
                        <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Đội (Team)</label>
                        <select name="team" value={formData.team} onChange={handleInputChange} required>
                            <option value="A">Đội A</option>
                            <option value="B">Đội B</option>
                        </select>
                    </div>
                    <div className="admin-form-group">
                        <label>Nhóm Xoay Ca (Rota Group)</label>
                        <select name="rotaGroup" value={formData.rotaGroup} onChange={handleInputChange} required>
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                <option key={n} value={n}>Nhóm {n}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="admin-submit-btn">
                        <i className="fa-solid fa-user-plus"></i> Thêm Bảo Vệ
                    </button>
                </form>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header">
                    <span>ID (Mã)</span>
                    <span>Họ Tên</span>
                    <span>Tài khoản</span>
                    <span>Đội</span>
                    <span>Nhóm</span>
                    <span>Hành Động</span>
                </div>
                {isLoading ? (
                    <div className="admin-list-row" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Đang tải...</div>
                ) : guards.length > 0 ? (
                    guards.map((guard) => (
                        <div className="admin-list-row" key={guard.id}>
                            <span>{guard.identityNumber}</span>
                            <span>{guard.fullName}</span>
                            <span>{guard.username}</span>
                            <span>{guard.team}</span>
                            <span>{guard.rotaGroup}</span>
                            <span>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteGuard(guard.id)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="admin-list-row" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                        Không có bảo vệ nào. Hãy thêm mới.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminManageGuards;