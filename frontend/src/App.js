import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import LandingPage from './pages/LandingPage/LandingPage';
import PageNotFound from './pages/PageNotFound/PageNotFound';
// import UnderConstruction from './pages/UnderConstruction/UnderConstruction';
import TimeSeries from './charts/TimeSeries';
import TimeSeriesClass from './charts/TimeSeriesClass';

const App = () => (
  <BrowserRouter>
    <Header />
    {/* <TimeSeries width={500} height={200} />
    <TimeSeriesClass width={500} height={200} /> */}
    <main>
      <Routes>
        <Route path="/" element={<LandingPage />} exact />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);

export default App;
