import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { TasksPage } from "./components/TasksPage";
import type { User } from "./components/types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return <TasksPage user={user} onLogout={() => setUser(null)} />;
}
