//import { useEffect, useState } from 'react';
//import axios from 'axios';

import './App.css';
import KanbanBoard from './components/KanbanBoard';

//interface Board {
//    id: number;
//    name: string;
//}
function App() {
    //const [board, setBoard] = useState<Board | null>(null);

    //useEffect(() => {
    //    axios.get('https://localhost:7125/api/board')
    //        .then(response => setBoard(response.data))
    //        .catch(error => console.error(error));
    //}, []);

    return (
        //<div>
        //    {board ? (
        //        <h1>Board: {board.name}</h1>
        //    ) : (
        //        <p>Loading...</p>
        //    )}
        //</div>
        <div>
            <h1>Trello Clone Test</h1>
            <KanbanBoard />
        </div>
    );
}

export default App;

//function App() {
//    const [forecasts, setForecasts] = useState<Forecast[]>();

//    useEffect(() => {
//        populateWeatherData();
//    }, []);

//    const contents = forecasts === undefined
//        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//        : <table className="table table-striped" aria-labelledby="tableLabel">
//            <thead>
//                <tr>
//                    <th>Date</th>
//                    <th>Temp. (C)</th>
//                    <th>Temp. (F)</th>
//                    <th>Summary</th>
//                </tr>
//            </thead>
//            <tbody>
//                {forecasts.map(forecast =>
//                    <tr key={forecast.date}>
//                        <td>{forecast.date}</td>
//                        <td>{forecast.temperatureC}</td>
//                        <td>{forecast.temperatureF}</td>
//                        <td>{forecast.summary}</td>
//                    </tr>
//                )}
//            </tbody>
//        </table>;

//    return (
//        <div>
//            <h1 id="tableLabel">Weather forecast</h1>
//            <p>This component demonstrates fetching data from the server.</p>
//            {contents}
//        </div>
//    );

//    async function populateWeatherData() {
//        const response = await fetch('weatherforecast');
//        if (response.ok) {
//            const data = await response.json();
//            setForecasts(data);
//        }
//    }
//}

//export default App;