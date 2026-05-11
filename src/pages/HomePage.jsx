import { getSessionTitle, moneyText, summarizeSession } from "../lib/split";

export default function HomePage({
  t,
  language,
  theme,
  cardClass,
  currentSession,
  setPage,
  logout,
}) {
  const summary = summarizeSession(currentSession || { expenses: [] });

  const mutedText =
    theme === "dark" ? "text-slate-400" : "text-slate-500";

  const buttonBase =
    "rounded-2xl px-4 py-4 text-left transition border";

  const actionClass =
    theme === "dark"
      ? "border-slate-800 bg-slate-900 hover:bg-slate-800"
      : "border-slate-200 bg-white hover:bg-slate-50";

  return (
    <div className="flex flex-col flex-1 gap-4 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${mutedText}`}>
            {t("appName")}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{t("menuTitle")}</h1>
          <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
            {t("menuSubtitle")}
          </p>
        </div>

        <button
          onClick={() => setPage("settings")}
          className="flex items-center justify-center w-10 h-10 text-lg transition border shadow-sm shrink-0 rounded-2xl border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
          aria-label="settings"
        >
          ⚙
        </button>
      </div>

      <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
        <p className="text-sm text-slate-500">{t("currentSessionLabel")}</p>
        <div className="flex items-end justify-between gap-3 mt-2">
          <div>
            <h2 className="text-xl font-bold">
              {getSessionTitle(currentSession.number, language)}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {summary.itemCount} {t("sessionCount")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">{t("total")}</p>
            <p className="text-lg font-bold text-blue-500">
              {moneyText(summary.total, language)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <button
          onClick={() => setPage("split")}
          className={`${buttonBase} ${actionClass}`}
        >
          <div className="font-semibold">{t("menuSplitTitle")}</div>
          <div className={`mt-1 text-sm leading-6 ${mutedText}`}>
            {t("menuSplitSub")}
          </div>
        </button>

        <button
          onClick={() => setPage("history")}
          className={`${buttonBase} ${actionClass}`}
        >
          <div className="font-semibold">{t("menuHistoryTitle")}</div>
          <div className={`mt-1 text-sm leading-6 ${mutedText}`}>
            {t("menuHistorySub")}
          </div>
        </button>
      </div>

      <button
        onClick={logout}
        className="px-4 py-3 mt-auto font-semibold text-red-500 transition border rounded-2xl border-red-500/20 bg-red-500/10 hover:bg-red-500/15"
      >
        Logout
      </button>
    </div>
  );
}