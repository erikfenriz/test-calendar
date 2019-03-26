import React from "react";
import dateFns from "date-fns";
import Calendar from '../Calendar';

let eventDaysStore = [];
let eventDays = new Set();
let dates = [];

class CalendarContainer extends React.Component {
    state = {
        currentMonth: new Date(),
        selectedDate: new Date(),
        events: [],
        eventDays: {},
        selection: ''
    };

    renderHeader = () => {
        return (
            <div className="header row flex-middle">
                <div className="col col-start">
                    <div className="icon" onClick={this.prevMonth}>
                        &#8249;
                    </div>
                </div>
                <div className="col col-center">
        <span>
          {dateFns.format(this.state.currentMonth, "MMMM YYYY")}
        </span>
                </div>
                <div className="col col-end" onClick={this.nextMonth}>
                    <div className="icon">&#8250;</div>
                </div>
            </div>
        );
    };

    renderDays = () => {
        const days = [];
        let startDate = dateFns.startOfWeek(this.state.currentMonth);

        [1, 2, 3, 4, 5, 6, 7].forEach(day => days.push(
            <div className="col col-center" key={day}>
                {dateFns.format(dateFns.addDays(startDate, day), "dddd")}
            </div>
        ));

        return <div className="days row">{days}</div>;
    };

    renderCells = () => {
        const {currentMonth, selectedDate} = this.state;
        const monthStart = dateFns.startOfMonth(currentMonth);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);
        const rows = [];
        let eventStore;
        let days = [];
        let day = startDate;
        let formattedDate = "";
        if (eventDaysStore.length > 0) {
            eventStore = eventDaysStore[0];
            console.log(eventStore[0]);
            var set = new Set(eventStore[0]);
            console.log(set);
        }
        while (day <= endDate) {
            [1, 2, 3, 4, 5, 6, 7].forEach(() => {
                formattedDate = dateFns.format(day, "D");
                const cloneDay = day;
                let stringDate = JSON.stringify(day);
                days.push(
                    <div
                        className={`col cell ${
                            !dateFns.isSameMonth(day, monthStart)
                                ? "disabled"
                                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                            }`}
                        key={day}
                        onMouseOver={() => this.onDateClick(dateFns.parse(cloneDay))}
                    >
                        <span className="number">{formattedDate}</span>
                        {eventDays.has(stringDate) || set.has(stringDate) ?
                            <h5 className="occupation">Busy
                            <span
                            key={day}
                            data-key={stringDate}
                            onClick={this.removeEvent}
                            className="deleteOccupation">
                            &#10013;
                            </span>
                            </h5> : ""}
                        <form className="button" onSubmit={this.addEvent}>
                            <select defaultValue={" "} onChange={this.handleSelectionChange} name="event">
                                {/*<option name="celebration" value="celebration">Celebration</option>*/}
                                {/*<option name="holiday" value="holiday">Holiday</option>*/}
                                {/*<option name="meeting" value="meeting">Meeting</option>*/}
                                <option name="busy" value="meeting">Busy</option>
                                <option name="" value=" "></option>
                            </select>
                            <input type="submit" value="&#x2B;"/>
                        </form>
                    </div>
                );
                day = dateFns.addDays(day, 1);
            });
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    };

    onDateClick = day => {
        this.setState({
            selectedDate: day
        });
    };

    nextMonth = () => {
        this.setState({
            currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
        });
    };

    prevMonth = () => {
        this.setState({
            currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
        });
    };

    handleSelectionChange = (e) => {
        this.setState({selection: e.target.value});
    };

    addEvent = (e) => {
        e.preventDefault();
        let {selectedDate, selection} = this.state;
        this.setState({selection: ""});
        if (selectedDate && selection !== "") {
            this.setState(prevState => ({
                events: [...prevState.events, {selectedDate, selection}]
            }));
            let stringDate = JSON.stringify(selectedDate);
            eventDays.add(stringDate);
            this.setStorage(eventDays);
        }
    };

    removeEvent = (e) => {
        e.stopPropagation();
        let eventsCopy = Object.assign(this.state.events);
        const selectedIndex = e.target.dataset.key;
        // const index = eventsCopy.indexOf(events[]);
        // if (index === -1) return;
        // newState.players.splice(index, 1);
        // this.setState(newState);
        // let index = eventsCopy.map(function (event) {
        //     return event.selectedDate
        // }).indexOf(200);
    };

    setStorage = (eventDays) => {
        let array = Array.from(eventDays);
        localStorage.setItem("set", JSON.stringify([array]));
    };

    retrieveStorage = () => {
        let retrieved = JSON.parse(localStorage.getItem('set'));
        eventDaysStore.push(retrieved);
    };

    setTitle = () => {
        document.title = `Calendar on ${this.state.selectedDate}`;
    };

    componentDidUpdate() {
        this.setTitle();
    }

    componentWillMount() {
        this.setTitle();
        if (localStorage.getItem("set") !== null) {
            this.retrieveStorage();
        }
    }

    render() {
        return (
            <Calendar
                renderHeader={this.renderHeader}
                days={this.renderDays}
                cells={this.renderCells}
            />
        )
    }
}

export default CalendarContainer;