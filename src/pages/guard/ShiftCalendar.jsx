import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './ShiftCalendar.css';

const ShiftCalendar = ({ shiftData }) => {
    const getTimeRange = (slot) => {
        switch (slot) {
            case "MORNING": return "07:30 - 11:30";
            case "AFTERNOON": return "11:30 - 15:30";
            case "EVENING": return "15:30 - 19:30";
            default: return "";
        }
    };

    const formatBlock = (block) => {
        return block.replace("BLOCK_", "Block ");
    };

    const renderEventContent = (eventInfo) => {
        return (
            <div className="fc-event-inner">
                <b>{eventInfo.timeText}</b>
                <i>{formatBlock(eventInfo.event.extendedProps.block)}</i>
            </div>
        );
    };

    const handleEventMount = (info) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'fc-tooltip';
        tooltip.innerHTML = `
        <strong>Ca:</strong> ${info.event.extendedProps.timeSlot}<br/>
        <strong>Giờ:</strong> ${getTimeRange(info.event.extendedProps.timeSlot)}<br/>
        <strong>Block:</strong> ${formatBlock(info.event.extendedProps.block)}
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
            eventDidMount={handleEventMount}
        />
    );
};

export default ShiftCalendar;
