import { useEffect, useMemo, useState } from "react";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SplitPage from "./pages/SplitPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";

import {
  createSession,
  normalizeExpense,
  normalizeSession,
  getSessionTitle,
} from "./lib/split";

const STORAGE_KEYS = {
  sessions: "wmm_sessions_v2",
  currentSession: "wmm_current_session_v2",
  theme: "wmm_theme_v2",
  lang: "wmm_lang_v2",
  auth: "wmm_auth_v2",
};

const dictionary = {
  th: {
    appName: "MoneySplit",
    loginTitle: "เข้าสู่ระบบ",
    loginSubtitle: "ทดลองใช้งานระบบหารค่าใช้จ่ายบนมือถือ",
    username: "ชื่อผู้ใช้",
    password: "รหัสผ่าน",
    loginButton: "เข้าสู่ระบบ",
    loginHint: "กรอกข้อมูลเพื่อเข้าใช้งานตัวอย่าง",
    menuTitle: "เมนูหลัก",
    menuSubtitle: "เลือกทำงานทีละอย่างเพื่อใช้งานง่าย",
    menuSplitTitle: "การหารค่าใช้จ่าย",
    menuSplitSub: "เพิ่มรายการ คำนวณ และบันทึกเป็นครั้ง",
    menuHistoryTitle: "ประวัติธุรกรรม",
    menuHistorySub: "ดูทุกครั้งที่บันทึกและสถานะการจ่าย",
    currentSessionLabel: "ครั้งปัจจุบัน",
    openSplit: "เริ่มการหาร",
    openHistory: "ดูประวัติ",
    settingsTitle: "การตั้งค่า",
    settingsSubtitle: "ปรับภาษาและโหมดแสดงผล",
    back: "ย้อนกลับ",
    splitTitle: "เริ่มการหาร",
    splitSubtitle: "เพิ่มได้หลายรายการใน 1 ครั้ง แล้วบันทึกเพื่อเริ่มครั้งใหม่",
    itemTitle: "ชื่อรายการ",
    price: "ราคา",
    peopleCount: "จำนวนคนที่หาร",
    useNames: "ระบุชื่อผู้ร่วมจ่ายเรียงตามลำดับ",
    useNamesHint: "ถ้าเลือก จะมีช่องให้พิมพ์ชื่อครบตามจำนวนคน",
    addItem: "เพิ่มรายการ",
    saveAndNext: "บันทึกและเริ่มครั้งใหม่",
    clearForm: "ล้างฟอร์ม",
    addedItems: "รายการในครั้งนี้",
    summaryTitle: "สรุปยอดแบบเรียลไทม์",
    summarySubtitle: "แยกตามชื่อ หรือสรุปตามจำนวนคนอัตโนมัติ",
    details: "รายละเอียด",
    hideDetails: "ซ่อนรายละเอียด",
    remove: "ลบ",
    total: "ยอดรวม",
    noItemYet: "ยังไม่มีรายการ",
    noItemHint: "เพิ่มรายการแรกเพื่อเริ่มคำนวณ",
    historyTitle: "ประวัติธุรกรรม",
    historySubtitle: "ดูรายการย้อนหลังและติ๊กว่าจ่ายแล้วหรือยัง",
    paid: "จ่ายแล้ว",
    unpaid: "ยังไม่จ่าย",
    paidStatus: "สถานะการจ่าย",
    transactionDate: "วันที่ทำธุรกรรม",
    paidCount: "จ่ายแล้ว",
    remainingCount: "คงเหลือ",
    sessionCount: "รายการ",
    noHistory: "ยังไม่มีประวัติ",
    noHistoryHint: "เมื่อบันทึกครั้งแรก รายการจะมาแสดงที่นี่",
    language: "ภาษา",
    theme: "โหมดแสดงผล",
    light: "สว่าง",
    dark: "มืด",
    thai: "ภาษาไทย",
    english: "English",
    save: "บันทึก",
    countOnly: "สรุปตามจำนวนคน",
    namedSummary: "สรุปตามชื่อ",
    grandSummary: "สรุปภาพรวม",
    sessionSaved: "บันทึกแล้ว",
    emptySession: "ยังไม่มีรายการในครั้งนี้",
    paidAll: "จ่ายครบแล้ว",
    unpaidOnly: "ยังเหลือบางส่วน",
    loginError: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
  },
  en: {
    appName: "MoneySplit",
    loginTitle: "Sign in",
    loginSubtitle: "Mobile demo for fair expense splitting",
    username: "Username",
    password: "Password",
    loginButton: "Sign in",
    loginHint: "Enter details to open the demo",
    menuTitle: "Main Menu",
    menuSubtitle: "One task at a time for easier use",
    menuSplitTitle: "Split Expenses",
    menuSplitSub: "Add items, calculate, and save as a session",
    menuHistoryTitle: "Transaction History",
    menuHistorySub: "Review saved sessions and payment status",
    currentSessionLabel: "Current session",
    openSplit: "Start splitting",
    openHistory: "Open history",
    settingsTitle: "Settings",
    settingsSubtitle: "Adjust language and display mode",
    back: "Back",
    splitTitle: "Start splitting",
    splitSubtitle: "Add multiple items in one session, then save to start a new one",
    itemTitle: "Item name",
    price: "Price",
    peopleCount: "Number of people",
    useNames: "Enter participant names in order",
    useNamesHint: "If enabled, fields will be created based on the selected count",
    addItem: "Add item",
    saveAndNext: "Save and start new session",
    clearForm: "Clear form",
    addedItems: "Items in this session",
    summaryTitle: "Live summary",
    summarySubtitle: "Split by names or count-only automatically",
    details: "Details",
    hideDetails: "Hide details",
    remove: "Remove",
    total: "Total",
    noItemYet: "No items yet",
    noItemHint: "Add the first item to begin calculating",
    historyTitle: "Transaction History",
    historySubtitle: "Review past sessions and tick paid status",
    paid: "Paid",
    unpaid: "Unpaid",
    paidStatus: "Payment status",
    transactionDate: "Transaction date",
    paidCount: "Paid",
    remainingCount: "Remaining",
    sessionCount: "items",
    noHistory: "No history yet",
    noHistoryHint: "Saved sessions will appear here",
    language: "Language",
    theme: "Display mode",
    light: "Light",
    dark: "Dark",
    thai: "Thai",
    english: "English",
    save: "Save",
    countOnly: "Count-only summary",
    namedSummary: "Named summary",
    grandSummary: "Overall summary",
    sessionSaved: "Saved",
    emptySession: "This session has no items yet",
    paidAll: "Fully paid",
    unpaidOnly: "Still pending",
    loginError: "Please enter username and password",
  },
};

export default function App() {
  const [page, setPage] = useState(() => {
    const auth = sessionStorage.getItem(STORAGE_KEYS.auth) === "1";
    return auth ? "home" : "login";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.theme) || "dark";
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.lang) || "th";
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.sessions);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeSession) : [];
    } catch {
      return [];
    }
  });

  const [currentSession, setCurrentSession] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.currentSession);
    if (saved) {
      try {
        return normalizeSession(JSON.parse(saved));
      } catch {
        return createSession(1);
      }
    }
    return createSession(1);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.lang, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.currentSession,
      JSON.stringify(currentSession)
    );
  }, [currentSession]);

  const t = useMemo(() => {
    return (key) => dictionary[language]?.[key] ?? dictionary.th[key] ?? key;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language === "th" ? "th" : "en";
  }, [language]);

  const appShellClass =
    theme === "dark"
      ? "min-h-screen bg-slate-950 text-slate-50"
      : "min-h-screen bg-slate-100 text-slate-900";

  const cardClass =
    theme === "dark"
      ? "border-slate-800 bg-slate-900/95"
      : "border-slate-200 bg-white";

  const openPage = (nextPage) => setPage(nextPage);

  const login = ({ username, password }) => {
    if (!username.trim() || !password.trim()) {
      alert(t("loginError"));
      return;
    }
    sessionStorage.setItem(STORAGE_KEYS.auth, "1");
    setPage("home");
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEYS.auth);
    setPage("login");
  };

  const addExpense = (expense) => {
    const normalized = normalizeExpense(expense);
    setCurrentSession((prev) => ({
      ...prev,
      expenses: [...prev.expenses, normalized],
    }));
  };

  const deleteExpense = (expenseId) => {
    setCurrentSession((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== expenseId),
    }));
  };

  const toggleExpenseDetails = (expenseId) => {
    setCurrentSession((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) =>
        e.id === expenseId ? { ...e, detailsOpen: !e.detailsOpen } : e
      ),
    }));
  };

  const saveCurrentSession = () => {
    if (!currentSession.expenses.length) {
      alert(t("emptySession"));
      return;
    }

    const savedSession = {
      ...currentSession,
      createdAt: currentSession.createdAt || new Date().toISOString(),
    };

    setSessions((prev) => [savedSession, ...prev]);

    const nextNumber = sessions.length + 2;
    setCurrentSession(createSession(nextNumber));
    setPage("history");
  };

  const togglePaid = (sessionId, expenseId, personIndex) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        return {
          ...session,
          expenses: session.expenses.map((expense) => {
            if (expense.id !== expenseId) return expense;

            const paid = [...expense.paid];
            paid[personIndex] = !paid[personIndex];

            return { ...expense, paid };
          }),
        };
      })
    );
  };

  const resetCurrentSession = () => {
    setCurrentSession(createSession(sessions.length + 1));
  };

  useEffect(() => {
    if (!currentSession?.expenses?.length) return;
  }, [currentSession]);

  return (
    <div className={appShellClass}>
      <div className="flex flex-col w-full max-w-md min-h-screen mx-auto">
        {page === "login" && (
          <LoginPage
            t={t}
            theme={theme}
            cardClass={cardClass}
            onLogin={login}
          />
        )}

        {page === "home" && (
          <HomePage
            t={t}
            language={language}
            theme={theme}
            cardClass={cardClass}
            currentSession={currentSession}
            setPage={openPage}
            logout={logout}
          />
        )}

        {page === "split" && (
          <SplitPage
            t={t}
            language={language}
            theme={theme}
            cardClass={cardClass}
            currentSession={currentSession}
            addExpense={addExpense}
            deleteExpense={deleteExpense}
            toggleExpenseDetails={toggleExpenseDetails}
            saveCurrentSession={saveCurrentSession}
            setPage={openPage}
            resetCurrentSession={resetCurrentSession}
          />
        )}

        {page === "history" && (
          <HistoryPage
            t={t}
            language={language}
            theme={theme}
            cardClass={cardClass}
            sessions={sessions}
            togglePaid={togglePaid}
            setPage={openPage}
          />
        )}

        {page === "settings" && (
          <SettingsPage
            t={t}
            language={language}
            theme={theme}
            cardClass={cardClass}
            setPage={openPage}
            setLanguage={setLanguage}
            setTheme={setTheme}
          />
        )}
      </div>
    </div>
  );
}