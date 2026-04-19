import { useState, useEffect } from "react";
import AddExpense from "./components/AddExpense";
import Summary from "./components/Summary";
import History from "./components/History";

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  return (
    <div className="min-h-screen px-4 py-10 text-gray-200 bg-neutral-950">

      <div className="max-w-xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-wide">
            WhereMyMoney
          </h1>
          <p className="text-sm text-gray-500">
            แบ่งเงินแบบเรียบง่าย
          </p>
        </div>

        {/* Add */}
        <div className="p-6 border rounded-xl border-neutral-800 bg-neutral-900">
          <AddExpense onAdd={(e) => setExpenses([...expenses, e])} />
        </div>

        {/* Summary */}
        <div className="p-6 border rounded-xl border-neutral-800 bg-neutral-900">
          <Summary expenses={expenses} />
        </div>

        {/* History */}
        <div className="p-6 border rounded-xl border-neutral-800 bg-neutral-900">
          <History expenses={expenses} />
        </div>

      </div>
    </div>
  );
}