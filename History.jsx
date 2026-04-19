export default function History({ expenses }) {
  return (
    <div>
      <p className="mb-3 text-sm text-gray-500">ประวัติ</p>

      <div className="space-y-2">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="flex justify-between p-3 text-sm border rounded-lg border-neutral-800 bg-neutral-800"
          >
            <span>{e.title}</span>
            <span className="text-amber-400">{e.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}