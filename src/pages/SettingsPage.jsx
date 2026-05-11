export default function SettingsPage({
  t,
  language,
  theme,
  cardClass,
  setPage,
  setLanguage,
  setTheme,
}) {
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

        <div className="w-10 h-10" />
      </div>

      <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
        <h1 className="text-2xl font-bold">{t("settingsTitle")}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {t("settingsSubtitle")}
        </p>
      </div>

      <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
        <div className="text-sm font-medium text-slate-500">{t("language")}</div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
        >
          <option value="th">{t("thai")}</option>
          <option value="en">{t("english")}</option>
        </select>
        <p className="mt-3 text-sm text-slate-500">
          {language === "th"
            ? "เปลี่ยนทั้งคำอธิบาย ปุ่ม และข้อความบนทุกหน้า"
            : "Changes labels, buttons, and visible text across the app"}
        </p>
      </div>

      <div className={`rounded-3xl border p-4 shadow-sm ${cardClass}`}>
        <div className="text-sm font-medium text-slate-500">{t("theme")}</div>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={`mt-3 w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
        >
          <option value="dark">{t("dark")}</option>
          <option value="light">{t("light")}</option>
        </select>
        <p className="mt-3 text-sm text-slate-500">
          {language === "th"
            ? "เลือกโหมดที่อ่านง่ายและเหมาะกับแสงรอบตัว"
            : "Choose the mode that is easiest to read in your environment"}
        </p>
      </div>
    </div>
  );
}