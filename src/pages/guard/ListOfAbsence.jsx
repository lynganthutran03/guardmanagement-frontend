import { React, useEffect, useContext} from 'react';
import { TitleContext } from '../../context/TitleContext';
import './ListOfAbsence.css';

const mockAbsences = [
  { id: 1, date: '2025-08-01', status: 'PENDING' },
  { id: 2, date: '2025-07-28', status: 'APPROVED' },
  { id: 3, date: '2025-07-25', status: 'DENIED' },
];

const ListOfAbsence = () => {
  const { setTitle } = useContext(TitleContext);
  const approvedCount = mockAbsences.filter(a => a.status === 'APPROVED').length;

  useEffect(() => {
    setTitle('Danh Sách Nghỉ Phép');
  }, [setTitle]);

  return (
    <div className="absence-list-container">
      <h3>Số lần nghỉ phép đã duyệt: {approvedCount}</h3>
      <table className="absence-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {mockAbsences.map(absence => (
            <tr key={absence.id}>
              <td>{absence.date}</td>
              <td>
                <span className={`status-tag ${absence.status.toLowerCase()}`}>
                  {absence.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListOfAbsence;
