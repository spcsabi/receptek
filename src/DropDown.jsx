import { useState } from "react";

export const DropDown = ({
  currencies,
  setCurrencies,
  selectedCurrency = "-select currency-",
  setSelectedCurrency,
}) => {
  // const [currencies, setCurrencies] = useState(["HUF", "AUD", "IDR", "NZD"]);
  const [newCurrency, setNewCurrency] = useState("");
  const [hideNewCurrency, setHideNewCurrency] = useState(true);

  function AddNewCurrency(value) {
    if (value === "") {
      console.log("empty");
      return;
    }
    setHideNewCurrency(true);
    setNewCurrency("");
    if (!currencies.includes(value)) {
      setCurrencies([...currencies, value]);
      console.log([...currencies, value]);
    } else {
      console.log("It's in");
    }
    setSelectedCurrency(value);
  }

  const handleChangeCurrency = (selectedValue) => {
    if (selectedValue === "+Add new currency") {
      setHideNewCurrency(false);
      setSelectedCurrency(selectedValue);
    } else {
      setHideNewCurrency(true);
      setSelectedCurrency(selectedValue);
    }
  };
  return (
    <>
      <select
        onChange={(e) => {
          handleChangeCurrency(e.target.value);
        }}
        value={selectedCurrency}
      >
        <option key="-select currency-" disabled hidden>
          -select currency-
        </option>
        {currencies.map((currency) => {
          return <option key={currency}>{currency}</option>;
        })}
        <option key="new currency">+Add new currency</option>
      </select>
      <div className={hideNewCurrency ? "hidden" : "flex items-center gap-3"}>
        <div></div>
        <input
          type="text"
          placeholder="new currency"
          value={newCurrency}
          onChange={(e) => {
            setNewCurrency(e.target.value.toUpperCase());
          }}
        ></input>
        <button
          className={
            "bg-yellow-300 border-yellow-500 hover:border-transparent rounded"
          }
          onClick={(e) => {
            AddNewCurrency(newCurrency);
            console.log("clicked");
          }}
        >
          +Add
        </button>
      </div>
    </>
  );
};
