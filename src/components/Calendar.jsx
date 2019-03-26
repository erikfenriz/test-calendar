import React from "react";

const Calendar = ({renderHeader, days, cells}) => {
    return (
        <div className="calendar">
            {renderHeader()}
            {cells()}
            {days()}
        </div>
    );
};

export default Calendar;