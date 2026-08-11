import { useState } from "react";
import { Pencil, Trash2, Calendar, CheckCircle2, Circle, Clock } from "lucide-react";
import type { Task, TaskStatus } from "./types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PENDING: {
    label: "Pendiente",
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: <Circle size={14} className="text-[#9ca3af]" />,
  },
  IN_PROGRESS: {
    label: "En progreso",
    color: "#b45309",
    bg: "#fef3c7",
    icon: <Clock size={14} className="text-[#d97706]" />,
  },
  DONE: {
    label: "Completada",
    color: "#166534",
    bg: "#dcfce7",
    icon: <CheckCircle2 size={14} className="text-[#16a34a]" />,
  },
};

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "PENDING",
};

function formatDate(dateStr: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(dateStr: string, status: TaskStatus) {
  if (!dateStr || status === "DONE") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  return due < today;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const config = STATUS_CONFIG[task.status];
  const overdue = isOverdue(task.dueDate, task.status);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  return (
    <div
      className={`group bg-white border rounded-xl px-4 py-3.5 flex items-start gap-3 transition-all hover:shadow-sm hover:border-[#d1d5db] ${
        task.status === "DONE" ? "border-[#e5e7eb] opacity-70" : "border-[#e5e7eb]"
      }`}
    >
      <button
        onClick={() => onStatusChange(task.id, STATUS_CYCLE[task.status])}
        className="mt-0.5 flex-shrink-0 text-[#9ca3af] hover:text-[#2563EB] transition-colors"
        title="Cambiar estado"
      >
        {task.status === "DONE" ? (
          <CheckCircle2 size={18} className="text-[#16a34a]" />
        ) : (
          <Circle size={18} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm text-[#1a1a2e] leading-snug ${
              task.status === "DONE" ? "line-through text-[#9ca3af]" : ""
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              title="Editar"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDelete}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                confirmDelete
                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                  : "text-[#9ca3af] hover:text-red-500 hover:bg-red-50"
              }`}
              title={confirmDelete ? "Confirmar eliminación" : "Eliminar"}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
            style={{ color: config.color, backgroundColor: config.bg }}
          >
            {config.icon}
            {config.label}
          </span>
          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                overdue ? "text-red-500" : "text-[#9ca3af]"
              }`}
            >
              <Calendar size={11} />
              {formatDate(task.dueDate)}
              {overdue && " · Vencida"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
