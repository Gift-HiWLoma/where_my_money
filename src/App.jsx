import { useState } from "react";
import AddExpense from "./components/AddExpense";
import Summary from "./components/Summary";
import History from "./components/History";

export default function App() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div className="min-h-screen p-6 text-white bg-black">
      <h1 className="mb-6 text-3xl font-bold text-orange-500">
        💸 Split Bill App
      </h1>

      <AddExpense onAdd={addExpense} />
      <Summary expenses={expenses} />
      <History expenses={expenses} />
    </div>
  );
}