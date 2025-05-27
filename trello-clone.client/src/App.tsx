//import { useEffect, useState } from 'react';
//import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import KanbanBoard from './features/kanban/KanbanBoard';
import About from './features/about/About';
import Tables from './features/tables/Tables';
import NavTabs from './components/NavTabs';
import { Box, Container } from '@mui/material';

function Header() {
  return (
    <Box component="header" sx={{
      width: '100%',
      bgcolor: 'background.paper',
      boxShadow: 1,
      mb: 2,
    }}>
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
        <Box sx={{ fontWeight: 'bold', fontSize: 24, letterSpacing: 1, mr: 2 }}>
          Trello Clone
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {/* NavTabs already contains navigation and theme toggle */}
      </Container>
      <NavTabs />
    </Box>
  );
}

function Footer() {
  return (
    <Box component="footer" sx={{
      width: '100%',
      bgcolor: 'background.paper',
      color: 'text.secondary',
      textAlign: 'center',
      py: 2,
      mt: 4,
      borderTop: 1,
      borderColor: 'divider',
      fontSize: 14,
    }}>
      © {new Date().getFullYear()} Trello Clone. All rights reserved.
    </Box>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="lg" sx={{ minHeight: '70vh', py: 3 }}>
      {children}
    </Container>
  );
}

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
    <Router>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<KanbanBoard />} />
          <Route path="/about" element={<About />} />
          <Route path="/tables" element={<Tables />} />
        </Routes>
      </MainContent>
      <Footer />
    </Router>
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