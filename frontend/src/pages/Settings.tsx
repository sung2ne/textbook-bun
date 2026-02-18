// frontend/src/pages/Settings.tsx
import { useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="settings-page">
      <h2>설정</h2>

      <div className="setting-item">
        <label>테마</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">라이트</option>
          <option value="dark">다크</option>
        </select>
      </div>

      <div className="setting-item">
        <label>알림</label>
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
      </div>
    </div>
  );
}
