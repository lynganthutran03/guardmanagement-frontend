import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './ShiftCalendar.css';

const ShiftCalendar = ({ shiftData }) => {
    const getTimeRange = (slot) => {
        switch (slot) {
            case "DAY_SHIFT": return "07:30 - 14:30";
            case "NIGHT_SHIFT": return "14:30 - 21:30";
            default: return "";
        }
    };

    const formatBlock = (location) => {
        if (!location) return "No Location";

        return location.replace("BLOCK_", "Block ")
                    .replace("GATE_", "Gate ");
    };

    const renderEventContent = (eventInfo) => {
        return (
            <div className="fc-event-inner">
                <b>{eventInfo.timeText}</b>
                <i>{formatBlock(eventInfo.event.extendedProps.location)}</i>
            </div>
        );
    };

    const handleEventMount = (info) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'fc-tooltip';
        tooltip.innerHTML = `
        <strong>Ca:</strong> ${info.event.extendedProps.timeSlot}<br/>
        <strong>Giờ:</strong> ${getTimeRange(info.event.extendedProps.timeSlot)}<br/>
        <strong>Khu vực:</strong> ${formatBlock(info.event.extendedProps.location)}
    `;

        document.body.appendChild(tooltip);

        const showTooltip = (e) => {
            tooltip.style.display = 'block';
            tooltip.style.position = 'absolute';
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        };

        const moveTooltip = (e) => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        };

        const hideTooltip = () => {
            tooltip.style.display = 'none';
        };

        info.el.addEventListener('mouseenter', showTooltip);
        info.el.addEventListener('mousemove', moveTooltip);
        info.el.addEventListener('mouseleave', hideTooltip);

        // Clean up if needed
        info.el._tooltipListeners = { showTooltip, moveTooltip, hideTooltip };
    };

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="vi"
            height="auto"
            events={shiftData.map(shift => ({
                title: `${shift.timeSlot} - ${shift.location}`,
                start: shift.shiftDate,
                color:
                    shift.timeSlot === "DAY_SHIFT"
                        ? "#4caf50"
                        : "#2196f3",
                extendedProps: {
                    location: shift.location,
                    timeSlot: shift.timeSlot,
                }
            }))}
            eventContent={renderEventContent}
            eventDidMount={handleEventMount}
        />
    );
};

export default ShiftCalendar;
