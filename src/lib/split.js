export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSession(number = 1) {
  return {
    id: uid(),
    number,
    expenses: [],
    createdAt: new Date().toISOString(),
  };
}

export function normalizeSession(session) {
  return {
    id: session?.id || uid(),
    number: Number(session?.number) || 1,
    createdAt: session?.createdAt || new Date().toISOString(),
    expenses: Array.isArray(session?.expenses)
      ? session.expenses.map(normalizeExpense)
      : [],
  };
}

export function normalizeExpense(expense) {
  const count = Math.max(1, Number(expense?.count) || 1);

  const names = Array.isArray(expense?.names)
    ? expense.names.slice(0, count)
    : [];

  while (names.length < count) names.push("");

  const paid = Array.isArray(expense?.paid)
    ? expense.paid.slice(0, count)
    : Array.from({ length: count }, () => false);

  while (paid.length < count) paid.push(false);

  return {
    id: expense?.id || uid(),
    title: String(expense?.title || "").trim(),
    amount: Number(expense?.amount) || 0,
    count,
    useNames: Boolean(expense?.useNames),
    names,
    paid,
    createdAt: expense?.createdAt || new Date().toISOString(),
    detailsOpen: Boolean(expense?.detailsOpen),
  };
}

export function getSessionTitle(number, lang = "th") {
  return lang === "th" ? `ครั้งที่ ${number}` : `Round ${number}`;
}

export function formatMoney(value, lang = "th") {
  const locale = lang === "th" ? "th-TH" : "en-US";
  return Number(value || 0).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function moneyText(value, lang = "th") {
  return lang === "th"
    ? `${formatMoney(value, lang)} บาท`
    : `฿${formatMoney(value, lang)}`;
}

export function getExpenseShare(expense) {
  const amount = Number(expense?.amount) || 0;
  const count = Math.max(1, Number(expense?.count) || 1);
  return amount / count;
}

export function getParticipantLabels(expense, lang = "th") {
  const count = Math.max(1, Number(expense?.count) || 1);
  const hasNames =
    expense?.useNames &&
    Array.isArray(expense?.names) &&
    expense.names.some((n) => String(n || "").trim() !== "");

  if (!hasNames) {
    return Array.from({ length: count }, (_, i) =>
      lang === "th" ? `คน ${i + 1}` : `Person ${i + 1}`
    );
  }

  return expense.names.slice(0, count).map((name, i) => {
    const clean = String(name || "").trim();
    return clean || (lang === "th" ? `คน ${i + 1}` : `Person ${i + 1}`);
  });
}

export function summarizeSession(session) {
  const expenses = Array.isArray(session?.expenses) ? session.expenses : [];

  const total = expenses.reduce(
    (sum, exp) => sum + (Number(exp.amount) || 0),
    0
  );

  const namedTotals = {};
  const namedItems = [];
  const countOnlyItems = [];

  expenses.forEach((exp) => {
    const share = getExpenseShare(exp);
    const labels = getParticipantLabels(exp, "th");

    const hasNames =
      exp.useNames &&
      Array.isArray(exp.names) &&
      exp.names.some((n) => String(n || "").trim() !== "");

    if (hasNames) {
      labels.forEach((name) => {
        namedTotals[name] = (namedTotals[name] || 0) + share;
      });

      namedItems.push({
        id: exp.id,
        title: exp.title,
        amount: Number(exp.amount) || 0,
        count: Math.max(1, Number(exp.count) || 1),
        share,
        labels,
      });
    } else {
      countOnlyItems.push({
        id: exp.id,
        title: exp.title,
        amount: Number(exp.amount) || 0,
        count: Math.max(1, Number(exp.count) || 1),
        share,
      });
    }
  });

  const namedTotalsList = Object.entries(namedTotals).sort((a, b) =>
    a[0].localeCompare(b[0], "th")
  );

  return {
    total,
    namedTotalsList,
    namedItems,
    countOnlyItems,
    itemCount: expenses.length,
  };
}