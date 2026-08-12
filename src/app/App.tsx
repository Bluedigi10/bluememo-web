import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { TasksPage } from "./components/TasksPage";
import type { User } from "./components/types";

type Screen = "login" | "register";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>("login");

  if (user) {
    return <TasksPage user={user} onLogout={() => { setUser(null); setScreen("login"); }} />;
  }

  if (screen === "register") {
    return (
      <RegisterPage
        onRegister={setUser}
        onGoToLogin={() => setScreen("login")}
      />
    );
  }

  return (
    <LoginPage
      onLogin={setUser}
      onGoToRegister={() => setScreen("register")}
    />
  );
}