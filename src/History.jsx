export default function History({ expenses }) {
  return (
    <div className="p-4 bg-gray-900 rounded">
      <h2 className="mb-2 text-orange-400">ประวัติ</h2>

      {expenses.map((e) => (
        <div key={e.id} className="mb-2">
          {e.title} - {e.amount} บาท ({e.paidBy})
        </div>
      ))}
    </div>
  );
}