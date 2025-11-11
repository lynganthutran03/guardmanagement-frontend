import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ManageLocation.css';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const AdminManageLocations = () => {
    const { setTitle } = useContext(TitleContext);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newLocationName, setNewLocationName] = useState('');

    useEffect(() => {
        setTitle('Quản Lý Khu Vực (Admin)');
        fetchLocations();
    }, [setTitle]);

    const fetchLocations = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/admin/locations");
            setLocations(res.data || []);
        } catch (err) {
            toast.error("Không thể tải danh sách khu vực.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateLocation = async (e) => {
        e.preventDefault();
        if (!newLocationName.trim()) {
            toast.warn("Tên khu vực không được để trống.");
            return;
        }

        try {
            await axios.post("/api/admin/locations", { name: newLocationName });
            toast.success(`Đã tạo khu vực "${newLocationName}" thành công!`);
            setNewLocationName('');
            fetchLocations();
        } catch (err) {
            toast.error("Lỗi khi tạo khu vực: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteLocation = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa khu vực "${name}"? Hành động này có thể gây lỗi nếu ca trực đang sử dụng nó.`)) {
            return;
        }

        try {
            await axios.delete(`/api/admin/locations/${id}`);
            toast.success(`Đã xóa khu vực "${name}".`);
            fetchLocations();
        } catch (err) {
            toast.error("Lỗi khi xóa khu vực: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="shift-history-page">
            <div className="filters" style={{ marginBottom: '20px' }}>
                <form onSubmit={handleCreateLocation} style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <input
                        type="text"
                        value={newLocationName}
                        onChange={(e) => setNewLocationName(e.target.value)}
                        placeholder="Nhập tên khu vực mới (ví dụ: Kho 1)"
                        className="form-control"
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="excel-export-btn">
                        <i className="fa-solid fa-plus"></i> Thêm Mới
                    </button>
                </form>
            </div>

            <div className="shift-history-table">
                <div className="shift-history-header" style={{ gridTemplateColumns: '1fr 3fr 1fr' }}>
                    <span>ID</span>
                    <span>Tên Khu Vực</span>
                    <span>Hành Động</span>
                </div>
                {isLoading ? (
                    <div className="shift-history-row" style={{ textAlign: 'center' }}>Đang tải...</div>
                ) : locations.length > 0 ? (
                    locations.map((loc) => (
                        <div className="shift-history-row" style={{ gridTemplateColumns: '1fr 3fr 1fr' }} key={loc.id}>
                            <span>{loc.id}</span>
                            <span>{loc.name}</span>
                            <span>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteLocation(loc.id, loc.name)}
                                >
                                    <i className="fa-solid fa-trash"></i> Xóa
                                </button>
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="shift-history-row" style={{ textAlign: 'center' }}>
                        Không có dữ liệu
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminManageLocations;