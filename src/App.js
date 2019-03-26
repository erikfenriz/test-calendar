import React, {Component} from 'react';
import ContainerCalendar from './components/Container/CalendarContainer';

class App extends Component {
    render() {
        return (
            <div className="App">
                <main>
                    <ContainerCalendar/>
                </main>
            </div>
        );
    }
}

export default App;
