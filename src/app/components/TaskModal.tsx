import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Task, TaskStatus } from "./types";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; status: TaskStatus; dueDate: string }) => void;
  task?: Task | null;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "PENDING", label: "Pendiente" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "DONE", label: "Completada" },
];

export function TaskModal({ open, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDueDate(task.dueDate || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      setDueDate("");
    }
    setError("");
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    onSave({ title: title.trim(), description: description.trim(), status, dueDate });
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 animate-in fade-in duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e5e7eb] p-6 animate-in fade-in zoom-in-95 duration-150 focus:outline-none">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-[#1a1a2e]">
              {task ? "Editar tarea" : "Nueva tarea"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#374151]">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(""); }}
                placeholder="Nombre de la tarea"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#374151]">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agrega detalles opcionales..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#374151]">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[#1a1a2e] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all text-sm appearance-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#374151]">Fecha límite</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[#1a1a2e] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all text-sm cursor-pointer"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <div className="flex gap-2 justify-end mt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm bg-[#2563EB] hover:bg-[#1d4ed8] text-white transition-colors"
              >
                {task ? "Guardar cambios" : "Crear tarea"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
