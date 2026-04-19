import { useState } from "react";

const users = ["A", "B", "C", "D"];

export default function AddExpense({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("A");
  const [participants, setParticipants] = useState([]);

  const toggleUser = (user) => {
    setParticipants((prev) =>
      prev.includes(user)
        ? prev.filter((u) => u !== user)
        : [...prev, user]
    );
  };

  const handleSubmit = () => {
    if (!title || !amount || participants.length === 0) return;

    onAdd({
      id: Date.now(),
      title,
      amount: Number(amount),
      paidBy,
      participants,
    });

    setTitle("");
    setAmount("");
    setParticipants([]);
  };

  return (
    <div className="p-4 mb-6 bg-gray-900 rounded">
      <input
        placeholder="รายการ"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 mb-2 text-black rounded"
      />

      <input
        placeholder="จำนวนเงิน"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 mb-2 text-black rounded"
      />

      <div className="mb-2">
        คนที่จ่าย:
        <select onChange={(e) => setPaidBy(e.target.value)}>
          {users.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </div>

      <div>
        คนที่หาร:
        {users.map((u) => (
          <label key={u} className="ml-2">
            <input
              type="checkbox"
              onChange={() => toggleUser(u)}
            />
            {u}
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 mt-3 text-black bg-orange-500 rounded"
      >
        เพิ่ม
      </button>
    </div>
  );
}