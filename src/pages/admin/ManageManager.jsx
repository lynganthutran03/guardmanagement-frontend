import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ManageManager.css';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const ManageManager = () => {
    const { setTitle } = useContext(TitleContext);
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        identityNumber: ''
    });

    useEffect(() => {
        setTitle('Quản Lý (Managers) (Admin)');
        fetchManagers();
    }, [setTitle]);

    const fetchManagers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/admin/managers"); 
            if (Array.isArray(res.data)) {
                setManagers(res.data);
            } else {
                console.error("API /api/admin/managers did not return an array:", res.data);
                setManagers([]); 
            }
        } catch (err) {
            toast.error("Không thể tải danh sách quản lý.");
            setManagers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateManager = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password || !formData.fullName || !formData.identityNumber) {
            toast.warn("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            await axios.post("/api/admin/managers", formData);
            toast.success(`Đã tạo quản lý "${formData.fullName}" thành công!`);
            setFormData({
                username: '', password: '', fullName: '', identityNumber: ''
            });
            fetchManagers();
        } catch (err) {
            toast.error("Lỗi khi tạo quản lý: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteManager = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa quản lý "${name}"? \n\nCẢNH BÁO: Nếu quản lý này đang phụ trách bất kỳ bảo vệ nào, việc xóa có thể gây lỗi. Hãy đảm bảo đã gán lại bảo vệ cho quản lý khác trước.`)) {
            return;
        }

        try {
            await axios.delete(`/api/admin/managers/${id}`);
            toast.success(`Đã xóa quản lý "${name}".`);
            fetchManagers();
        } catch (err) {
            toast.error("Lỗi khi xóa quản lý: " + (err.response?.data?.message || "Kiểm tra xem quản lý này còn được gán cho bảo vệ nào không."));
        }
    };

    return (
        <div className="admin-page-layout">
            <div className="admin-form-container">
                <h3>Thêm Quản Lý (Manager)</h3>
                <form onSubmit={handleCreateManager}>
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
                        <label>Mã Quản lý (Identity Number)</label>
                        <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="admin-submit-btn">
                        <i className="fa-solid fa-user-plus"></i> Thêm Quản Lý
                    </button>
                </form>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header" style={{ gridTemplateColumns: '1fr 2fr 1.5fr 1fr' }}>
                    <span>ID (Mã)</span>
                    <span>Họ Tên</span>
                    <span>Tài khoản</span>
                    <span>Hành Động</span>
                </div>
                {isLoading ? (
                    <div className="admin-list-row" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Đang tải...</div>
                ) : managers.length > 0 ? (
                    managers.map((manager) => (
                        <div className="admin-list-row" style={{ gridTemplateColumns: '1fr 2fr 1.5fr 1fr' }} key={manager.id}>
                            <span>{manager.identityNumber}</span>
                            <span>{manager.fullName}</span>
                            <span>{manager.username}</span>
                            <span>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteManager(manager.id, manager.fullName)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="admin-list-row" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                        Không có quản lý nào.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageManager;