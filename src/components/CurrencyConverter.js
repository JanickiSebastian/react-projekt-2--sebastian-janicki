import React, { useState } from "react";
import "./App.css";

const apiUrl = "https://api.nbp.pl/api/exchangerates/rates/a/";

const Loader = () => <div className="loader" id="loader"></div>;

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleLoader = (show) => {
    setLoading(show);
  };

  const getCurrencyRate = async (currency) => {
    const response = await fetch(`${apiUrl}${currency}`);
    const data = await response.json();
    return data.rates[0].mid;
  };

  const calculateResult = (rate, amount) => {
    const result = rate * amount;
    return result.toFixed(2);
  };

  const isValidAmount = (amount) => {
    return parseFloat(amount) >= 0.01;
  };

  const convertCurrency = async () => {
    if (!isValidAmount(amount)) {
      setResult("Błędna kwota. Wpisz liczbę większą lub równą 0.01.");
      return;
    }

    toggleLoader(true);
    try {
      const rate = await getCurrencyRate(selectedCurrency);
      const calculatedResult = calculateResult(rate, amount);
      setResult(`${amount} ${selectedCurrency} = ${calculatedResult} PLN`);
    } catch (error) {
      setResult("Błąd. Spróbuj ponownie później.");
    }
    toggleLoader(false);
  };

  return (
    <div className="container">
      <h1 className="header-text">Przelicznik walut</h1>
      {loading && <Loader />}
      <div className="input-container">
        <label className="sum" htmlFor="currency">
          Wybierz walutę:
        </label>
        <select
          className="sizes-input-select"
          id="currency"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="EUR">Euro</option>
          <option value="USD">Dolary amerykańskie</option>
          <option value="CHF">Franki szwajcarskie</option>
        </select>
      </div>
      <div className="input-container">
        <label className="sum" htmlFor="amount">
          Kwota:
        </label>
        <input
          className="sizes-input-select"
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button className="calculate" onClick={convertCurrency}>
        Przelicz
      </button>
      <div className="result" id="result">
        {result}
      </div>
    </div>
  );
};

export default CurrencyConverter;
