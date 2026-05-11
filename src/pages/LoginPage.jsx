import { useState } from "react";

export default function LoginPage({ t, theme, cardClass, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const inputClass =
    theme === "dark"
      ? "border-slate-800 bg-slate-950 text-slate-50 placeholder:text-slate-500"
      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400";

  return (
    <div className="flex items-center justify-center flex-1 min-h-screen px-4 py-8">
      <div className={`w-full rounded-3xl border p-5 shadow-sm ${cardClass}`}>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("appName")}
          </p>
          <h1 className="mt-2 text-2xl font-bold">{t("loginTitle")}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {t("loginSubtitle")}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-slate-500">
              {t("username")}
            </label>
            <input
              className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500/20 ${inputClass}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("username")}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-500">
              {t("password")}
            </label>
            <input
              type="password"
              className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500/20 ${inputClass}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
            />
          </div>

          <button
            onClick={() => onLogin({ username, password })}
            className="w-full px-4 py-3 font-semibold text-white transition bg-blue-600 rounded-2xl hover:bg-blue-500"
          >
            {t("loginButton")}
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          {t("loginHint")}
        </p>
      </div>
    </div>
  );
}