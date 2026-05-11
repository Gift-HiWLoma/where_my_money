import { useEffect, useState } from "react";
import {
  getParticipantLabels,
  getSessionTitle,
  moneyText,
  summarizeSession,
} from "../lib/split";

export default function HistoryPage({
  t,
  language,
  theme,
  cardClass,
  sessions,
  togglePaid,
  setPage,
}) {
  const [openSessionId, setOpenSessionId] = useState(null);

  useEffect(() => {
    if (!openSessionId && sessions.length > 0) {
      setOpenSessionId(sessions[0].id);
    }
  }, [sessions, openSessionId]);

  const inputClass =
    theme === "dark"
      ? "border-slate-800 bg-slate-950 text-slate-50"
      : "border-slate-200 bg-white text-slate-900";

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
        <h1 className="text-2xl font-bold">{t("historyTitle")}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {t("historySubtitle")}
        </p>
      </div>

      <div className="space-y-3">
        {!sessions.length && (
          <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
            <div className="text-sm text-slate-500">{t("noHistory")}</div>
            <div className="mt-1 text-sm text-slate-500">{t("noHistoryHint")}</div>
          </div>
        )}

        {sessions.map((session) => {
          const summary = summarizeSession(session);
          const isOpen = openSessionId === session.id;
          const dateText = new Date(session.createdAt).toLocaleString(
            language === "th" ? "th-TH" : "en-US",
            {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          return (
            <div key={session.id} className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
              <button
                onClick={() =>
                  setOpenSessionId((prev) => (prev === session.id ? null : session.id))
                }
                className="flex items-center justify-between w-full gap-3 text-left"
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {getSessionTitle(session.number, language)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{dateText}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">{t("total")}</div>
                  <div className="font-bold text-blue-500">
                    {moneyText(summary.total, language)}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-2xl border-slate-700/60 bg-slate-950/20">
                      <div className="text-xs text-slate-500">{t("sessionCount")}</div>
                      <div className="mt-1 text-lg font-semibold">
                        {summary.itemCount}
                      </div>
                    </div>

                    <div className="p-3 border rounded-2xl border-slate-700/60 bg-slate-950/20">
                      <div className="text-xs text-slate-500">{t("total")}</div>
                      <div className="mt-1 text-lg font-semibold">
                        {moneyText(summary.total, language)}
                      </div>
                    </div>
                  </div>

                  {session.expenses.length === 0 && (
                    <div className="px-4 py-5 text-sm border border-dashed rounded-2xl border-slate-700 text-slate-500">
                      {t("emptySession")}
                    </div>
                  )}

                  {session.expenses.map((expense) => {
                    const labels = getParticipantLabels(expense, language);
                    const paidCount = expense.paid.filter(Boolean).length;
                    const remainingCount = expense.paid.length - paidCount;

                    return (
                      <div
                        key={expense.id}
                        className="p-4 border rounded-2xl border-slate-700/60 bg-slate-950/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold">{expense.title}</div>
                            <div className="mt-1 text-sm text-slate-500">
                              {moneyText(expense.amount, language)} · {expense.count}{" "}
                              {language === "th" ? "คน" : "people"}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-semibold text-blue-500">
                              {moneyText(expense.amount / expense.count, language)} /{" "}
                              {language === "th" ? "คน" : "person"}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {paidCount} {t("paid")} · {remainingCount} {t("unpaid")}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="text-sm font-medium text-slate-500">
                            {t("paidStatus")}
                          </div>

                          <div className="grid gap-2">
                            {labels.map((name, index) => (
                              <label
                                key={`${expense.id}-${index}`}
                                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${inputClass}`}
                              >
                                <span className="min-w-0 truncate">{name}</span>
                                <input
                                  type="checkbox"
                                  checked={Boolean(expense.paid[index])}
                                  onChange={() =>
                                    togglePaid(session.id, expense.id, index)
                                  }
                                  className="w-4 h-4"
                                />
                              </label>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3 border rounded-2xl border-emerald-500/20 bg-emerald-500/10">
                              <div className="text-xs text-emerald-400">{t("paid")}</div>
                              <div className="mt-1 text-sm font-semibold">
                                {paidCount}
                              </div>
                            </div>

                            <div className="p-3 border rounded-2xl border-amber-500/20 bg-amber-500/10">
                              <div className="text-xs text-amber-400">
                                {t("remainingCount")}
                              </div>
                              <div className="mt-1 text-sm font-semibold">
                                {remainingCount}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}