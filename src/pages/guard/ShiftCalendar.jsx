import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './ShiftCalendar.css'; // Keep your styles if needed

const ShiftCalendar = ({ shiftData }) => {
    function renderEventContent(eventInfo) {
        return (
            <div style={{ fontSize: "12px", padding: "2px" }}>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.extendedProps.block}</i>
            </div>
        );
    }

    console.log("Shift data going to FullCalendar:", shiftData);
    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="vi"
            height="auto"
            events={shiftData.map(shift => ({
                title: `${shift.timeSlot} - ${shift.block}`,
                start: shift.shiftDate,
                color:
                    shift.timeSlot === "MORNING"
                        ? "#4caf50"
                        : shift.timeSlot === "AFTERNOON"
                            ? "#ff9800"
                            : "#2196f3",
                extendedProps: {
                    block: shift.block,
                    timeSlot: shift.timeSlot,
                }
            }))}
            eventContent={renderEventContent}
        />
    );
};

export default ShiftCalendar;
