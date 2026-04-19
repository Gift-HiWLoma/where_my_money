import { useState } from "react";

export default function AddExpense({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState([]);
  const [newUser, setNewUser] = useState("");

  // ➕ เพิ่มคน
  const addUser = () => {
    if (!newUser.trim()) return;
    setParticipants([...participants, newUser]);
    setNewUser("");
  };

  // ❌ ลบคน
  const removeUser = (name) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  const submit = () => {
    if (!title || !amount || participants.length === 0 || !paidBy) return;

    onAdd({
      id: Date.now(),
      title,
      amount: Number(amount),
      paidBy,
      participants,
    });

    setTitle("");
    setAmount("");
    setPaidBy("");
    setParticipants([]);
  };

  return (
    <div className="space-y-4">

      {/* รายการ */}
      <input
        placeholder="รายการ"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 bg-transparent border rounded border-neutral-700"
      />

      {/* จำนวนเงิน (เลขเท่านั้น) */}
      <input
        type="number"
        placeholder="จำนวนเงิน"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 bg-transparent border rounded border-neutral-700"
      />

      {/* คนที่จ่าย */}
      <input
        placeholder="ใครจ่าย"
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        className="w-full p-3 bg-transparent border rounded border-neutral-700"
      />

      {/* เพิ่มคน */}
      <div className="flex gap-2">
        <input
          placeholder="เพิ่มชื่อคน"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          className="flex-1 p-3 bg-transparent border rounded border-neutral-700"
        />
        <button
          onClick={addUser}
          className="px-4 text-black rounded bg-amber-400"
        >
          +
        </button>
      </div>

      {/* รายชื่อ */}
      <div className="flex flex-wrap gap-2">
        {participants.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-neutral-800"
          >
            {p}
            <button
              onClick={() => removeUser(p)}
              className="text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* ปุ่ม */}
      <button
        onClick={submit}
        className="w-full py-3 text-black rounded bg-amber-400"
      >
        เพิ่มรายการ
      </button>

    </div>
  );
}