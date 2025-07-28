import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './ShiftCalendar.css'; // Keep your styles if needed

const ShiftCalendar = ({ shiftData }) => {
    const events = shiftData.map(shift => ({
        title: `${shift.timeSlot} - ${shift.block}`,
        date: shift.shiftDate
    }));

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            locale="vi" // optional: Vietnamese
            firstDay={1} // optional: start on Monday
        />
    );
};

export default ShiftCalendar;
