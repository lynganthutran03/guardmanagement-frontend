import { React, useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { TitleContext } from '../../context/TitleContext';
import './ShiftGenerate.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';

axios.defaults.withCredentials = true;

const ShiftGenerate = () => {
    const { setTitle } = useContext(TitleContext);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedMonday, setSelectedMonday] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [allGuards, setAllGuards] = useState([]);
    const [teamGuards, setTeamGuards] = useState([]);

    useEffect(() => {
        setTitle('Tạo Lịch Làm Việc Theo Đội');
    }, [setTitle]);

    useEffect(() => {
        axios.get('/api/guards', { withCredentials: true })
            .then(res => {
                setAllGuards(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch guards:", err);
                toast.error("Không thể tải danh sách bảo vệ.");
            });
    }, []);

    useEffect(() => {
        if (selectedTeam && allGuards.length > 0) {
            const guardsInSelectedTeam = allGuards.filter(guard => guard.team === selectedTeam);
            setTeamGuards(guardsInSelectedTeam);
        } else {
            setTeamGuards([]);
        }
    }, [selectedTeam, allGuards]);

    const handleDaySelect = (date) => {
        if (date) {
            const monday = startOfWeek(date, { weekStartsOn: 1 });
            setSelectedMonday(monday);
        } else {
            setSelectedMonday(undefined);
        }
    };

    const handleGenerateWeekForTeam = async () => {
        if (!selectedTeam) {
            toast.error("Vui lòng chọn một đội.");
            return;
        }
        if (!selectedMonday) {
            toast.error("Vui lòng chọn tuần.");
            return;
        }

        const formattedStartDate = format(selectedMonday, 'yyyy-MM-dd');

        setIsLoading(true);

        const payload = {
            team: selectedTeam,
            weekStartDate: formattedStartDate
        };

        try {
            const res = await axios.post('/api/manager/schedule/generate-week-for-team', payload);
            toast.success(res.data.message || `Tạo lịch tuần thành công cho Đội ${selectedTeam}!`);
            setSelectedTeam('');
            setSelectedMonday(undefined);
        } catch (err) {
            const message = err.response?.data?.message || `Lỗi khi tạo lịch tuần cho Đội ${selectedTeam}.`;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="shift-generate-page">
            <div className="generate-box container">
                <div className="input-section row">
                    <div className="col">
                        <label className="form-label">Chọn tuần bắt đầu:</label>
                        <div className="day-picker-container">
                            <DayPicker
                                mode="single"
                                showWeekNumber
                                selected={selectedMonday}
                                onSelect={handleDaySelect}
                                showOutsideDays
                                fixedWeeks
                                locale={vi}
                                weekStartsOn={1}
                                modifiersClassNames={{
                                    selected: 'my-selected-day',
                                    today: 'my-today-day'
                                }}
                            />
                            <p className="footer-placeholder text-muted small">
                                {!selectedMonday ? 'Vui lòng chọn ngày đầu tuần.' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="col">
                        <label className="form-label">Chọn đội:</label>
                        <select
                            className="form-select"
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)} required>
                            <option value="">-- Chọn Đội --</option>
                            <option value="A">Đội A</option>
                            <option value="B">Đội B</option>
                        </select>
                        {selectedTeam && (
                            <div className="team-guard-list mt-3">
                                <h6 className="mb-2">Bảo vệ trong Đội {selectedTeam}:</h6>
                                {teamGuards.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {teamGuards.map(guard => (
                                            <li key={guard.id} className="list-group-item d-flex justify-content-between align-items-center py-1">
                                                {guard.fullName}
                                                <small className="text-muted">(ID: {guard.identityNumber}, Gr: {guard.rotaGroup || 'N/A'})</small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted small">Không có bảo vệ nào trong đội này.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    className="btn btn-success w-100"
                    onClick={handleGenerateWeekForTeam}
                    disabled={isLoading || !selectedTeam || !selectedMonday}
                >
                    {isLoading ? "Đang tạo..." : "Tạo Lịch 7 Ngày Cho Đội"}
                </button>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ShiftGenerate;