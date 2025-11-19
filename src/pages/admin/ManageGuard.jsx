import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ManageGuard.css';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const ManageGuard = () => {
    const { setTitle } = useContext(TitleContext);
    const [guards, setGuards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingGuardId, setEditingGuardId] = useState(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username ||  !formData.fullName || !formData.identityNumber) {
            toast.warn("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if(!editingGuardId && !formData.password) {
            toast.warn("Vui lòng nhập mật khẩu cho bảo vệ mới.");
            return;
        }

        try {
            if(editingGuardId) {
                await axios.put(`/api/admin/guards/${editingGuardId}`, formData);
                toast.success(`Đã cập nhật bảo vệ "${formData.fullName}" thành công!`);
            } else {
                await axios.post("/api/admin/guards", formData);
                toast.success(`Đã tạo bảo vệ "${formData.fullName}" thành công!`);
            }

            resetForm();
            fetchData();
        } catch (err) {
            const action = editingGuardId ? "cập nhật" : "tạo";
            toast.error(`Lỗi khi ${action} bảo vệ: ` + (err.response?.data?.message || err.message));
        }
    };

    const handleEditClick = (guard) => {
        setEditingGuardId(guard.id);
        setFormData({
            username: guard.username,
            password: '',
            fullName: guard.fullName,
            identityNumber: guard.identityNumber,
            team: guard.team || 'A',
            rotaGroup: guard.rotaGroup || 1
        });
        window.scrollTo({ top: 0, behavior: 'smooth'});
    };

    const handleCancelEdit = () => {
        resetForm();
    }

    const resetForm = () => {
        setEditingGuardId(null);
        setFormData({
            username: '', password: '', fullName: '', identityNumber: '', team: 'A', rotaGroup: 1
        });
    };

    const handleDeleteGuard = async (id) => {
        if(!window.confirm("Bạn có chắc chắn muốn xoá bảo vệ này không? Hành động này không thể hoàn tác.")) {
            return;
        }

        try {
            await axios.delete(`/api/admin/guards/${id}`);
            toast.success("Đã xoá bảo vệ thành công.");
            fetchData();
        } catch (err) {
            const message = err.response?.data?.message || "Lỗi khi xoá bảo vệ.";
            toast.error(message);
        }
    };

    return (
        <div className="admin-page-layout">
            <div className="admin-form-container">
                <h3>{editingGuardId ? 'Cập Nhật Bảo Vệ' : 'Thêm Bảo Vệ Mới'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Tên đăng nhập (username)</label>
                        <input 
                            type="text" name="username" 
                            value={formData.username} onChange={handleInputChange} 
                            required 
                            disabled={!!editingGuardId}
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Mật khẩu {editingGuardId && <small>(Để trống nếu không đổi)</small>}</label>
                        <input 
                            type="password" name="password" 
                            value={formData.password} onChange={handleInputChange} 
                            required={!editingGuardId}
                        />
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
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>Nhóm {n}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="admin-submit-btn">
                        <i className={`fa-solid ${editingGuardId ? 'fa-save' : 'fa-user-plus'}`}></i> 
                        {editingGuardId ? ' Cập Nhật' : ' Thêm Bảo Vệ'}
                    </button>

                    {editingGuardId && (
                        <button type="button" className="admin-submit-btn" style={{backgroundColor: '#6c757d', marginTop: '10px'}} onClick={handleCancelEdit}>
                            <i className="fa-solid fa-times"></i> Hủy Bỏ
                        </button>
                    )}
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
                            <span style={{display: 'flex', gap: '5px'}}>
                                <button 
                                    className="delete-btn" 
                                    style={{backgroundColor: '#ffc107', color: '#000'}}
                                    onClick={() => handleEditClick(guard)}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                
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

export default ManageGuard;