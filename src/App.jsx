import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [weatherData, setWeatherData] = useState('Loading...');
  const [goalData, setGoalData] = useState('Loading...');
  const [stockPrice, setStockPrice] = useState(null);
  const [dailyChange, setDailyChange] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = 'XQ9P89GN3NW4V2CZ';
  const symbol = 'TSLA'; // Tesla as an example stock

  // Helper function to fetch stock data
  const fetchStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const todayData = timeSeries[today];
        const yesterdayData = timeSeries[yesterday];

        if (todayData && yesterdayData) {
          const todayPrice = parseFloat(todayData['4. close']);
          const yesterdayPrice = parseFloat(yesterdayData['4. close']);
          const change = todayPrice - yesterdayPrice;
          const percentChange = ((change / yesterdayPrice) * 100).toFixed(2);

          setStockPrice(todayPrice.toFixed(2));
          setDailyChange(change.toFixed(2));
          setPercentageChange(percentChange);
        } else {
          setError('Data for today or yesterday is missing.');
        }
      } else {
        setError('Failed to retrieve stock data.');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('An error occurred while fetching stock data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock data on mount and every hour
  useEffect(() => {
    fetchStockData();
    const intervalId = setInterval(fetchStockData, 3600000); // Fetch every hour
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dark-theme">
      <header>
        <h1>Steampunk Dashboard</h1>
      </header>
      <main className="dashboard">
        <section className="dashboard-section">
          <h2>Weather</h2>
          <div>{weatherData}</div>
        </section>
        <section className="dashboard-section">
          <h2>Stock Market</h2>
          {loading ? (
            <p>Loading stock data...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div>
              <p>Current Price: ${stockPrice}</p>
              <p className={dailyChange >= 0 ? 'stock-up' : 'stock-down'}>
                Change Today: ${dailyChange} ({percentageChange}%)
              </p>
            </div>
          )}
        </section>
        <section className="dashboard-section">
          <h2>Goal Tracking</h2>
          <div>{goalData}</div>
        </section>
      </main>
    </div>
  );
}

export default App;