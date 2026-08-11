import { useState, useMemo } from "react";
import { Plus, Search, LogOut, CheckSquare, ListTodo, CheckCircle2, Clock, Circle, SlidersHorizontal, X } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import type { Task, TaskStatus, User } from "./types";

interface TasksPageProps {
  user: User;
  onLogout: () => void;
}

type FilterStatus = "ALL" | TaskStatus;

const DEMO_TASKS: Task[] = [
  {
    id: "1",
    title: "Revisar diseño de la aplicación",
    description: "Validar la paleta de colores y la tipografía con el equipo de diseño.",
    status: "DONE",
    dueDate: "2026-07-28",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    title: "Implementar sistema de autenticación",
    description: "Crear flujo de login con validación de formulario y manejo de errores.",
    status: "IN_PROGRESS",
    dueDate: "2026-08-05",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "3",
    title: "Escribir pruebas unitarias",
    description: "Cubrir los componentes principales con tests usando Vitest.",
    status: "PENDING",
    dueDate: "2026-08-10",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    title: "Preparar presentación para el cliente",
    description: "",
    status: "PENDING",
    dueDate: "2026-08-07",
    createdAt: new Date().toISOString(),
  },
];

const FILTER_TABS: { value: FilterStatus; label: string; icon: React.ReactNode }[] = [
  { value: "ALL", label: "Todas", icon: <ListTodo size={14} /> },
  { value: "PENDING", label: "Pendientes", icon: <Circle size={14} /> },
  { value: "IN_PROGRESS", label: "En progreso", icon: <Clock size={14} /> },
  { value: "DONE", label: "Completadas", icon: <CheckCircle2 size={14} /> },
];

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function TasksPage({ user, onLogout }: TasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const counts = useMemo(() => ({
    ALL: tasks.length,
    PENDING: tasks.filter((t) => t.status === "PENDING").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  }), [tasks]);

  const filtered = useMemo(() => {
    let list = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tasks, filter, search]);

  const handleSave = (data: { title: string; description: string; status: TaskStatus; dueDate: string }) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => t.id === editingTask.id ? { ...t, ...data } : t)
      );
    } else {
      const newTask: Task = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <CheckSquare size={16} className="text-white" />
            </div>
            <span className="text-[#1a1a2e] text-sm">Mis Tareas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
              <span className="text-[#2563EB] text-xs">{initials}</span>
            </div>
            <span className="text-sm text-[#374151] hidden sm:block">{user.name}</span>
            <button
              onClick={onLogout}
              className="ml-1 w-7 h-7 rounded-md flex items-center justify-center text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[#1a1a2e]">Tareas</h2>
            <p className="text-sm text-[#9ca3af]">{counts.ALL} {counts.ALL === 1 ? "tarea" : "tareas"} en total</p>
          </div>
          <button
            onClick={handleNewTask}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm transition-colors shadow-sm"
          >
            <Plus size={16} />
            Nueva tarea
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tareas..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-5 bg-white border border-[#e5e7eb] rounded-xl p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-all ${
                filter === tab.value
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#6b7280] hover:text-[#374151] hover:bg-[#f3f4f6]"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`text-xs rounded-full px-1.5 ${
                filter === tab.value ? "bg-white/20 text-white" : "bg-[#f3f4f6] text-[#6b7280]"
              }`}>
                {counts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Task list */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-2">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#f3f4f6] flex items-center justify-center mb-3">
              {search ? <Search size={20} className="text-[#9ca3af]" /> : <SlidersHorizontal size={20} className="text-[#9ca3af]" />}
            </div>
            <p className="text-[#374151] text-sm">
              {search ? `No hay resultados para "${search}"` : "No hay tareas en esta categoría"}
            </p>
            {!search && (
              <button
                onClick={handleNewTask}
                className="mt-3 text-sm text-[#2563EB] hover:underline"
              >
                Crear una nueva tarea
              </button>
            )}
          </div>
        )}

        {/* Stats footer */}
        {tasks.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: "Pendientes", count: counts.PENDING, color: "#6b7280", bg: "#f3f4f6" },
              { label: "En progreso", count: counts.IN_PROGRESS, color: "#b45309", bg: "#fef3c7" },
              { label: "Completadas", count: counts.DONE, color: "#166534", bg: "#dcfce7" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#e5e7eb] rounded-xl p-3 text-center">
                <div
                  className="text-lg mb-0.5"
                  style={{ color: s.color }}
                >
                  {s.count}
                </div>
                <p className="text-xs text-[#9ca3af]">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
