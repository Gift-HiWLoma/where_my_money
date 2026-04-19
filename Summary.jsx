export default function Summary({ expenses }) {
  return (
    <div className="space-y-4">

      <p className="text-sm text-gray-400">สรุปรายการ</p>

      {expenses.map((e) => {
        const share = e.amount / e.participants.length;

        return (
          <div
            key={e.id}
            className="p-4 border rounded border-neutral-800 bg-neutral-800"
          >
            <p className="font-semibold text-amber-400">
              {e.title} ({e.amount} บาท)
            </p>

            <p className="mb-2 text-sm text-gray-400">
              จ่ายโดย: {e.paidBy}
            </p>

            {/* รายชื่อ + เงิน */}
            <ul className="space-y-1 text-sm">
              {e.participants.map((p, i) => (
                <li key={i} className="flex justify-between">
                  <span>{p}</span>
                  <span>
                    {share.toFixed(2)} บาท
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

    </div>
  );
}