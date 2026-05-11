import { useEffect, useMemo, useState } from "react";
import {
  getExpenseShare,
  getParticipantLabels,
  getSessionTitle,
  moneyText,
  summarizeSession,
} from "../lib/split";

export default function SplitPage({
  t,
  language,
  theme,
  cardClass,
  currentSession,
  addExpense,
  deleteExpense,
  toggleExpenseDetails,
  saveCurrentSession,
  setPage,
  resetCurrentSession,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [count, setCount] = useState(2);
  const [useNames, setUseNames] = useState(false);
  const [names, setNames] = useState([]);
  const [openDetailId, setOpenDetailId] = useState(null);

  const inputClass =
    theme === "dark"
      ? "border-slate-800 bg-slate-950 text-slate-50 placeholder:text-slate-500"
      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400";

  useEffect(() => {
    const next = Math.max(1, Number(count) || 1);
    setNames((prev) => {
      const copy = [...prev.slice(0, next)];
      while (copy.length < next) copy.push("");
      return copy;
    });
  }, [count]);

  useEffect(() => {
    if (!useNames) return;
    const next = Math.max(1, Number(count) || 1);
    setNames((prev) => {
      const copy = [...prev.slice(0, next)];
      while (copy.length < next) copy.push("");
      return copy;
    });
  }, [useNames, count]);

  useEffect(() => {
    setOpenDetailId(null);
  }, [currentSession?.id]);

  const summary = useMemo(() => {
    return summarizeSession(currentSession || { expenses: [] });
  }, [currentSession]);

  const handleAdd = () => {
    const cleanTitle = title.trim();
    const numAmount = Number(amount);
    const numCount = Math.max(1, Number(count) || 1);

    if (!cleanTitle || !numAmount || numAmount <= 0) return;

    const finalNames = useNames
      ? names.slice(0, numCount).map((n, i) => {
          const clean = String(n || "").trim();
          return clean || (language === "th" ? `คน ${i + 1}` : `Person ${i + 1}`);
        })
      : [];

    addExpense({
      title: cleanTitle,
      amount: numAmount,
      count: numCount,
      useNames,
      names: finalNames,
      paid: Array.from({ length: numCount }, () => false),
      createdAt: new Date().toISOString(),
      detailsOpen: false,
    });

    setTitle("");
    setAmount("");
    setCount(2);
    setUseNames(false);
    setNames([]);
  };

  const toggleDetail = (expenseId) => {
    setOpenDetailId((prev) => (prev === expenseId ? null : expenseId));
    toggleExpenseDetails(expenseId);
  };

  return (
    <div className="flex flex-col flex-1 gap-4 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setPage("home")}
          className="px-3 py-2 text-sm font-medium transition border rounded-2xl border-slate-700 hover:bg-slate-800"
        >
          {t("back")}
        </button>

        <button
          onClick={() => setPage("settings")}
          className="flex items-center justify-center w-10 h-10 text-lg transition border rounded-2xl border-slate-700 bg-slate-900 hover:bg-slate-800"
          aria-label="settings"
        >
          ⚙
        </button>
      </div>

      <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {getSessionTitle(currentSession.number, language)}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{t("splitTitle")}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {t("splitSubtitle")}
        </p>
      </div>

      <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
        <h2 className="text-lg font-semibold">{t("itemTitle")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("summarySubtitle")}</p>

        <div className="mt-4 space-y-3">
          <input
            className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("itemTitle")}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("price")}
            />

            <input
              className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
              type="number"
              min="1"
              step="1"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder={t("peopleCount")}
            />
          </div>

          <label className="flex items-start gap-3 px-4 py-3 text-sm leading-6 border rounded-2xl border-slate-700/60">
            <input
              type="checkbox"
              checked={useNames}
              onChange={(e) => setUseNames(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="block font-medium">{t("useNames")}</span>
              <span className="block text-slate-500">{t("useNamesHint")}</span>
            </span>
          </label>

          {useNames && (
            <div className="space-y-2">
              {Array.from({ length: Math.max(1, Number(count) || 1) }).map((_, i) => (
                <input
                  key={i}
                  className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
                  value={names[i] || ""}
                  onChange={(e) => {
                    const next = [...names];
                    next[i] = e.target.value;
                    setNames(next);
                  }}
                  placeholder={
                    language === "th" ? `ชื่อคนที่ ${i + 1}` : `Person ${i + 1}`
                  }
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAdd}
              className="px-4 py-3 font-semibold text-white transition bg-blue-600 rounded-2xl hover:bg-blue-500"
            >
              {t("addItem")}
            </button>

            <button
              onClick={() => {
                setTitle("");
                setAmount("");
                setCount(2);
                setUseNames(false);
                setNames([]);
              }}
              className="px-4 py-3 font-semibold transition border rounded-2xl border-slate-700 hover:bg-slate-800"
            >
              {t("clearForm")}
            </button>
          </div>
        </div>
      </div>

      <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{t("addedItems")}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {currentSession.expenses.length} {t("sessionCount")}
            </p>
          </div>
          <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-100">
            {currentSession.expenses.length}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {!currentSession.expenses.length && (
            <div className="px-4 py-5 text-sm border border-dashed rounded-2xl border-slate-700 text-slate-500">
              {t("noItemYet")}
              <div className="mt-1">{t("noItemHint")}</div>
            </div>
          )}

          {currentSession.expenses.map((exp) => {
            const share = getExpenseShare(exp);
            const labels = getParticipantLabels(exp, language);
            const isOpen = openDetailId === exp.id || exp.detailsOpen;

            return (
              <div
                key={exp.id}
                className="p-4 border rounded-2xl border-slate-700/60 bg-slate-950/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{exp.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {moneyText(exp.amount, language)} · {exp.count}{" "}
                      {language === "th" ? "คน" : "people"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-500">
                      {moneyText(share, language)} /{" "}
                      {language === "th" ? "คน" : "person"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => toggleDetail(exp.id)}
                    className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-800"
                  >
                    {isOpen ? t("hideDetails") : t("details")}
                  </button>

                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                  >
                    {t("remove")}
                  </button>
                </div>

                {isOpen && (
                  <div className="pt-4 mt-4 space-y-2 text-sm border-t border-slate-800">
                    <div className="text-slate-500">{t("details")}</div>
                    {exp.useNames && labels.length > 0 ? (
                      labels.map((name, i) => (
                        <div
                          key={`${exp.id}-${i}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <span>{name}</span>
                          <span className="font-medium">
                            {moneyText(share, language)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <span>
                          {exp.count} {language === "th" ? "คน" : "people"}
                        </span>
                        <span className="font-medium">
                          {exp.count} × {moneyText(share, language)} ={" "}
                          {moneyText(exp.amount, language)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{t("summaryTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("summarySubtitle")}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">{t("total")}</div>
            <div className="text-xl font-bold text-blue-500">
              {moneyText(summary.total, language)}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {!currentSession.expenses.length ? (
            <div className="px-4 py-5 text-sm border border-dashed rounded-2xl border-slate-700 text-slate-500">
              {t("noItemYet")}
            </div>
          ) : (
            <>
              {summary.namedTotalsList.length > 0 && (
                <div className="p-4 border rounded-2xl border-slate-700/60 bg-slate-950/20">
                  <h3 className="font-semibold">{t("namedSummary")}</h3>
                  <div className="mt-3 space-y-2">
                    {summary.namedTotalsList.map(([name, value]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="truncate">{name}</span>
                        <span className="font-semibold">
                          {moneyText(value, language)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {summary.countOnlyItems.length > 0 && (
                <div className="p-4 border rounded-2xl border-slate-700/60 bg-slate-950/20">
                  <h3 className="font-semibold">{t("countOnly")}</h3>
                  <div className="mt-3 space-y-2">
                    {summary.countOnlyItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-slate-500">
                            {item.count}{" "}
                            {language === "th" ? "คน" : "people"} ×{" "}
                            {moneyText(item.share, language)}
                          </div>
                        </div>
                        <div className="font-semibold">
                          {moneyText(item.amount, language)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 border rounded-2xl border-slate-700/60 bg-slate-950/20">
                <h3 className="font-semibold">{t("grandSummary")}</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>{t("total")}</span>
                    <span className="font-semibold text-white">
                      {moneyText(summary.total, language)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>{t("sessionCount")}</span>
                    <span className="font-semibold text-white">
                      {summary.itemCount}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={saveCurrentSession}
            className="px-4 py-3 font-semibold text-white transition rounded-2xl bg-emerald-600 hover:bg-emerald-500"
          >
            {t("saveAndNext")}
          </button>

          <button
            onClick={() => setPage("history")}
            className="px-4 py-3 font-semibold transition border rounded-2xl border-slate-700 hover:bg-slate-800"
          >
            {t("openHistory")}
          </button>
        </div>
      </div>
    </div>
  );
}