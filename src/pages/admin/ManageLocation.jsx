import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ManageLocation.css';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const ManageLocation = () => {
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
            const sortedData = (res.data || []).sort((a, b) => a.id - b.id);
            setLocations(sortedData);
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
            toast.error("Lỗi khi tạo khu vực.");
        }
    };

    const handleDeleteLocation = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa khu vực "${name}"?`)) return;

        try {
            await axios.delete(`/api/admin/locations/${id}`);
            toast.success(`Đã xóa khu vực "${name}".`);
            fetchLocations();
        } catch (err) {
            toast.error("Lỗi khi xóa khu vực (có thể đang được sử dụng).");
        }
    };

    return (
        <div className="admin-page-layout">
            <div className="admin-form-container">
                <h3>Thêm Khu Vực Mới</h3>
                <form onSubmit={handleCreateLocation}>
                    <div className="admin-form-group">
                        <label>Tên Khu Vực (ví dụ: Gate 1, Block A)</label>
                        <input
                            type="text"
                            value={newLocationName}
                            onChange={(e) => setNewLocationName(e.target.value)}
                            placeholder="Nhập tên..."
                            required
                        />
                    </div>
                    <button type="submit" className="admin-submit-btn">
                        <i className="fa-solid fa-plus"></i> Thêm Mới
                    </button>
                </form>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header">
                    <span>ID</span>
                    <span>Tên Khu Vực</span>
                    <span>Hành Động</span>
                </div>
                
                {isLoading ? (
                    <div className="admin-list-row" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                        Đang tải...
                    </div>
                ) : locations.length > 0 ? (
                    locations.map((loc) => (
                        <div className="admin-list-row" key={loc.id}>
                            <span>{loc.id}</span>
                            <span>{loc.name}</span>
                            <span>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteLocation(loc.id, loc.name)}
                                >
                                    <i className="fa-solid fa-trash"></i> Xóa
                                </button>
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="admin-list-row" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                        Không có dữ liệu
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLocation;