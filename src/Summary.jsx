export default function Summary({ expenses }) {
  const balances = {};

  expenses.forEach((exp) => {
    const share = exp.amount / exp.participants.length;

    exp.participants.forEach((p) => {
      if (p !== exp.paidBy) {
        const key = `${p}->${exp.paidBy}`;
        balances[key] = (balances[key] || 0) + share;
      }
    });
  });

  return (
    <div className="p-4 mb-6 bg-gray-900 rounded">
      <h2 className="mb-2 text-orange-400">สรุปการจ่าย</h2>

      {Object.entries(balances).map(([key, amount]) => {
        const [from, to] = key.split("->");
        return (
          <p key={key}>
            {from} ต้องจ่าย {to} = {amount.toFixed(2)} บาท
          </p>
        );
      })}
    </div>
  );
}