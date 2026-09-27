import { useState, useEffect } from "react";
import useStore from "./store/store";

export default function Test() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");

  // Store állapotok és akciók
  const transactions = useStore((state) => state.transactions);
  const isLoaded = useStore((state) => state.isLoaded);
  const { addTransaction, deleteTransaction } = useStore(
    (state) => state.actions,
  );


  const handleChangeAmount = (e) => {
    const amount = e.target.value;
    if (amount === "") {
      setAmount("");
    } else {
      setAmount(Number(amount));
    }
  };

  const handleAddNewTransaction = () => {
    const newTransaction = {
      name,
      amount,
      currency,
    };
    addTransaction(newTransaction);
  };

  return (
    <div className="flex flex-col items-left w-1/2">
      <hr></hr>
      <form className="flex flex-col items-left gap-2 m-2">
        <label>Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="new item"
          className="border rounded-2xl p-2"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label>Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          placeholder="amount"
          className="border rounded-2xl p-2"
          value={amount}
          onChange={handleChangeAmount}
        />
        <label>Currency:</label>
        <input
          type="text"
          id="currency"
          name="currency"
          placeholder="HUF"
          className="border rounded-2xl p-2"
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
          }}
        />
      </form>
      <button
        className="bg-emerald-500 p-2 m-2 rounded-2xl"
        onClick={handleAddNewTransaction}
      >
        Enter
      </button>
      <hr></hr>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody className="text-center font-light">
          {transactions.map((item) => {
            return (
              <tr key={item.id}>
                <td className="border border-b-cyan-950">{item.name}</td>
                <td className="border border-b-cyan-950">{item.amount}</td>
                <td className="border border-b-cyan-950">{item.currency}</td>

                <td className="border border-b-cyan-950">
                  <button
                  className="bg-red-200"
                    onClick={() => {
                      deleteTransaction(item.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
