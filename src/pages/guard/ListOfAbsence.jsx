import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ListOfAbsence.css';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

axios.defaults.withCredentials = true;

const statusMap = {
  PENDING: { text: 'Đang chờ', className: 'pending' },
  APPROVED: { text: 'Đã duyệt', className: 'approved' },
  DENIED: { text: 'Đã từ chối', className: 'denied' }
};

const ListOfAbsence = () => {
  const { setTitle } = useContext(TitleContext);
  const [requestsHistory, setRequestsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const approvedCount = requestsHistory.filter(a => a.status === 'APPROVED').length;

  useEffect(() => {
    setTitle('Danh Sách Nghỉ Phép');
    fetchHistory();
  }, [setTitle]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/leave-requests/history");
      setRequestsHistory(res.data);
    } catch (err) {
      toast.error("Không thể tải lịch sử nghỉ phép.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    return statusMap[status] || { text: status, className: 'pending' };
  };

  const handleExportExcel = () => {
    if (requestsHistory.length === 0) {
      toast.warn("Không có dữ liệu để xuất.");
      return;
    }
    toast.info("Đang chuẩn bị file Excel...");

    const exportData = requestsHistory.map(req => {
      const statusDisplay = getStatusDisplay(req.status);
      return {
        'Ngày bắt đầu': parseISO(req.startDate).toLocaleDateString('vi-VN'),
        'Ngày kết thúc': parseISO(req.endDate).toLocaleDateString('vi-VN'),
        'Lý do': req.reason,
        'Trạng thái': statusDisplay.text
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LichSuNghiPhep");

    const cols = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...exportData.map(row => (row[key] || "").toString().length)) + 2
    }));
    ws["!cols"] = cols;

    XLSX.writeFile(wb, "LichSuNghiPhep_CaNhan.xlsx");
  };

  if (isLoading) {
    return <div className="absence-list-container"><p>Đang tải lịch sử...</p></div>;
  }

  return (
    <div className="absence-list-container">
      <div className="absence-header-controls">
        <h3>Số lần nghỉ phép đã duyệt: {approvedCount}</h3>
        <button
          onClick={handleExportExcel}
          className="excel-export-btn"
          disabled={requestsHistory.length === 0}
        >
          <i className="fa-solid fa-file-excel"></i> Xuất Excel
        </button>
      </div>

      <table className="absence-table">
        <thead>
          <tr>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Lý do</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {requestsHistory.length > 0 ? (
            requestsHistory.map(req => {
              const statusDisplay = getStatusDisplay(req.status);
              return (
                <tr key={req.id}>
                  <td>{parseISO(req.startDate).toLocaleDateString('vi-VN')}</td>
                  <td>{parseISO(req.endDate).toLocaleDateString('vi-VN')}</td>
                  <td>{req.reason}</td>
                  <td>
                    <span className={`status-tag ${statusDisplay.className}`}>
                      {statusDisplay.text}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Bạn chưa có yêu cầu nghỉ phép nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListOfAbsence;