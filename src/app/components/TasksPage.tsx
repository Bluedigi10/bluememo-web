import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  CheckSquare,
  Circle,
  Clock3,
  ListTodo,
  LogOut,
  Plus,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import type { Task, TaskStatus, User } from "./types";

interface TasksPageProps {
  user: User;
  onLogout: () => void;
}

type FilterStatus = "ALL" | TaskStatus;

function localDate(daysFromToday: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

const DEMO_TASKS: Task[] = [
  {
    id: "1",
    title: "Planear las prioridades de la semana",
    description: "Define lo que realmente quieres terminar antes del viernes.",
    status: "IN_PROGRESS",
    dueDate: localDate(0),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Preparar la presentación del proyecto",
    description: "Reúne avances, decisiones y los siguientes pasos.",
    status: "PENDING",
    dueDate: localDate(1),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Revisar los comentarios pendientes",
    description: "Responder las observaciones que bloquean el siguiente avance.",
    status: "PENDING",
    dueDate: localDate(3),
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Organizar las notas de la última reunión",
    description: "",
    status: "DONE",
    dueDate: localDate(-1),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const FILTER_TABS: { value: FilterStatus; label: string; icon: React.ReactNode }[] = [
  { value: "ALL", label: "Todo", icon: <ListTodo size={14} /> },
  { value: "PENDING", label: "Pendientes", icon: <Circle size={14} /> },
  { value: "IN_PROGRESS", label: "En curso", icon: <Clock3 size={14} /> },
  { value: "DONE", label: "Hechas", icon: <CheckCircle2 size={14} /> },
];

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatLongDate() {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" }).format(
    new Date(`${date}T12:00:00`),
  );
}

export function TasksPage({ user, onLogout }: TasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowQuickAdd(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const counts = useMemo(() => ({
    ALL: tasks.length,
    PENDING: tasks.filter((task) => task.status === "PENDING").length,
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    DONE: tasks.filter((task) => task.status === "DONE").length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    let taskList = filter === "ALL" ? tasks : tasks.filter((task) => task.status === filter);
    if (search.trim()) {
      const query = search.toLowerCase();
      taskList = taskList.filter(
        (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
      );
    }
    return [...taskList].sort((a, b) => {
      if (a.status === "DONE" && b.status !== "DONE") return 1;
      if (a.status !== "DONE" && b.status === "DONE") return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [filter, search, tasks]);

  const upcomingTasks = useMemo(
    () => tasks.filter((task) => task.status !== "DONE").sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3),
    [tasks],
  );

  const completion = counts.ALL ? Math.round((counts.DONE / counts.ALL) * 100) : 0;
  const firstName = user.name.trim().split(" ")[0] || "ahí";
  const initials = user.name.split(" ").map((name) => name[0]).slice(0, 2).join("").toUpperCase();

  const handleSave = (data: { title: string; description: string; status: TaskStatus; dueDate: string }) => {
    if (editingTask) {
      setTasks((previous) => previous.map((task) => task.id === editingTask.id ? { ...task, ...data } : task));
    } else {
      setTasks((previous) => [{ id: generateId(), ...data, createdAt: new Date().toISOString() }, ...previous]);
    }
    setEditingTask(null);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#17213a]">
      <header className="sticky top-0 z-20 border-b border-[#e8edf7]/90 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2475eb] to-[#4547cc] shadow-[0_8px_20px_rgba(45,92,219,0.24)]">
              <CheckSquare size={20} strokeWidth={2.5} className="text-white" />
            </div>
            <div>
              <p className="text-[17px] font-bold tracking-[-0.04em] text-[#17213a]">BlueMemo</p>
              <p className="hidden text-xs text-[#8692aa] sm:block">Haz espacio para lo importante</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="ml-1 flex items-center gap-2 rounded-xl border border-[#edf0f6] bg-white py-1 pl-1 pr-1.5 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e8f0ff] text-[10px] font-bold text-[#2764dd]">{initials}</div>
              <span className="hidden max-w-28 truncate text-sm font-medium text-[#34415a] lg:block">{user.name}</span>
              <button onClick={onLogout} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#9aa6bc] transition-colors hover:bg-[#f9eded] hover:text-[#d45a5a]" title="Cerrar sesión">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
        <section ref={heroRef} id="inicio" className="relative isolate scroll-mt-24 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1e67df] via-[#355bd2] to-[#5147c7] px-6 py-7 text-white shadow-[0_20px_45px_rgba(47,82,190,0.22)] sm:px-9 sm:py-9">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#80c4ff]/20 blur-2xl" />
          <div className="absolute bottom-0 right-[20%] h-32 w-32 rounded-full bg-[#8a78ff]/25 blur-xl" />
          <div className="relative grid items-center gap-7 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-[#e2ecff]">
                <Sparkles size={14} />
                {formatLongDate()}
              </div>
              <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-[-0.045em] sm:text-4xl">Hola, {firstName}.<br />Un paso a la vez.</h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#dbe9ff] sm:text-base">BlueMemo te ayuda a convertir tus pendientes en avances visibles, sin perder el foco.</p>
              <button onClick={handleNewTask} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#245ed8] shadow-lg shadow-[#193eaa]/20 transition-transform hover:-translate-y-0.5 hover:bg-[#f7fbff]">
                <Plus size={17} strokeWidth={2.5} />
                Añadir una tarea
              </button>
            </div>

            <div className="flex items-center gap-5 rounded-2xl border border-white/15 bg-white/[0.11] px-5 py-4 backdrop-blur-sm sm:px-6">
              <div className="relative grid h-20 w-20 place-items-center rounded-full" style={{ background: `conic-gradient(#ffffff ${completion * 3.6}deg, rgba(255,255,255,.22) 0deg)` }}>
                <div className="grid h-[68px] w-[68px] place-items-center rounded-full bg-[#345bd2]">
                  <span className="text-lg font-bold tracking-[-0.04em]">{completion}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.13em] text-[#c7dcff]">Tu avance</p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">{counts.DONE} de {counts.ALL} completadas</p>
                <p className="mt-1 text-xs text-[#d8e6ff]">Sigue así, vas tomando ritmo.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Por hacer", value: counts.PENDING, icon: <Circle size={18} />, accent: "text-[#496178]", background: "bg-white", iconBg: "bg-[#edf2f8]" },
            { label: "En progreso", value: counts.IN_PROGRESS, icon: <Clock3 size={18} />, accent: "text-[#b06c19]", background: "bg-[#fffaf1]", iconBg: "bg-[#fff0d4]" },
            { label: "Terminadas", value: counts.DONE, icon: <Check size={18} strokeWidth={3} />, accent: "text-[#2e8d68]", background: "bg-[#f4fcf8]", iconBg: "bg-[#dcf5e9]" },
          ].map((metric) => (
            <div key={metric.label} className={`flex items-center gap-3 rounded-2xl border border-[#e7edf5] p-4 shadow-[0_3px_12px_rgba(24,42,73,0.025)] ${metric.background}`}>
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${metric.iconBg} ${metric.accent}`}>{metric.icon}</div>
              <div>
                <p className="text-xl font-bold tracking-[-0.04em] text-[#1e2b43]">{metric.value}</p>
                <p className="text-xs text-[#7d8aa0]">{metric.label}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div id="mis-tareas" className="scroll-mt-24">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5b78be]">Espacio de trabajo</p>
                <h2 className="mt-1 text-2xl font-bold tracking-[-0.045em] text-[#19243a]">Tus tareas</h2>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5ebf4] bg-white p-3 shadow-[0_10px_30px_rgba(23,45,83,0.04)] sm:p-4">
              <div className="flex flex-col gap-3 border-b border-[#eef2f7] pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 rounded-xl bg-[#f4f7fb] p-1">
                  {FILTER_TABS.map((tab) => (
                    <button key={tab.value} onClick={() => setFilter(tab.value)} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 ${filter === tab.value ? "bg-white text-[#245ed8] shadow-sm" : "text-[#8390a5] hover:text-[#41506a]"}`}>
                      {tab.icon}
                      <span>{tab.label}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === tab.value ? "bg-[#eaf1ff] text-[#2764dc]" : "bg-[#e9eef5] text-[#7d8aa0]"}`}>{counts[tab.value]}</span>
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-48">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a5ba]" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar" className="w-full rounded-xl border border-[#e6ebf3] bg-[#fbfcfe] py-2 pl-9 pr-8 text-sm text-[#27344d] outline-none transition focus:border-[#8eaeeb] focus:bg-white focus:ring-4 focus:ring-[#eaf2ff]" />
                  {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#97a4b8] hover:bg-[#eef2f7]"><X size={14} /></button>}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {filteredTasks.length ? filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={(selectedTask) => { setEditingTask(selectedTask); setModalOpen(true); }} onDelete={(id) => setTasks((previous) => previous.filter((task) => task.id !== id))} onStatusChange={(id, status) => setTasks((previous) => previous.map((task) => task.id === id ? { ...task, status } : task))} />
                )) : (
                  <div className="py-12 text-center">
                    <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[#eef3fb] text-[#8a9ab6]"><Search size={19} /></div>
                    <p className="mt-3 text-sm font-medium text-[#526078]">No encontramos tareas aquí</p>
                    <button onClick={() => { setSearch(""); setFilter("ALL"); }} className="mt-1 text-xs font-semibold text-[#2964db]">Limpiar filtros</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#e5ebf4] bg-white p-5 shadow-[0_10px_30px_rgba(23,45,83,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5b78be]">Próximamente</p>
                  <h2 className="mt-1 text-lg font-bold tracking-[-0.035em] text-[#1d2940]">En tu radar</h2>
                </div>
                <CalendarDays size={19} className="text-[#7291d1]" />
              </div>
              <div className="mt-4 space-y-1">
                {upcomingTasks.length ? upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#f7f9fd]">
                    <div className="min-w-10 rounded-lg bg-[#edf3ff] px-1 py-1.5 text-center text-[10px] font-bold uppercase text-[#3c6fd0]">{formatShortDate(task.dueDate)}</div>
                    <p className="line-clamp-2 text-sm font-medium leading-snug text-[#44516a]">{task.title}</p>
                  </div>
                )) : <p className="py-6 text-center text-sm text-[#8c98aa]">Sin tareas pendientes.</p>}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#162449] p-5 text-white shadow-[0_12px_28px_rgba(25,47,92,0.16)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#9dc6ff]"><Target size={18} /></div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#9eb6e9]">Tu objetivo</p>
              <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em]">Termina una tarea importante hoy.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#bdccea]">Los avances pequeños sostenidos también cuentan.</p>
            </div>
          </aside>
        </section>
      </main>

      <button
        type="button"
        onClick={handleNewTask}
        aria-label="Crear una tarea"
        title="Crear una tarea"
        className={`fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#2464dc] text-white shadow-[0_12px_28px_rgba(36,100,220,0.35)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#1d55c5] hover:shadow-[0_16px_32px_rgba(36,100,220,0.4)] focus:outline-none focus:ring-4 focus:ring-[#bcd4ff] sm:bottom-8 sm:right-8 ${showQuickAdd ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"}`}
      >
        <Plus size={26} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <TaskModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} onSave={handleSave} task={editingTask} />
    </div>
  );
}
