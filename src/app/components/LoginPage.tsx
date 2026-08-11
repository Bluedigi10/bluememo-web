import { useState } from "react";
import { CheckSquare, Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const name = email.split("@")[0].replace(/[._]/g, " ");
      const formatted = name.charAt(0).toUpperCase() + name.slice(1);
      onLogin({ name: formatted, email });
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center mb-4 shadow-sm">
            <CheckSquare size={20} className="text-white" />
          </div>
          <h1 className="text-[#1a1a2e] mb-1">Mis Tareas</h1>
          <p className="text-[#6b7280] text-sm">Inicia sesión para continuar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#374151]">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#374151]">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-2.5 rounded-lg transition-all text-sm mt-1 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {isLoading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-xs text-[#9ca3af] text-center mt-5">
            Usa cualquier correo y contraseña para entrar
          </p>
        </div>
      </div>
    </div>
  );
}
