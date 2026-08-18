import { useState } from "react";
import { CheckSquare, Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "../../lib/api";

type LoginResponse = {
  token: string;
};

interface RegisterPageProps {
  onRegister: (user: { name: string; email: string }) => void;
  onGoToLogin: () => void;
}

export function RegisterPage({ onRegister, onGoToLogin }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      e.name = "El nombre debe tener al menos 2 caracteres.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Ingresa un correo electrónico válido.";
    }
    if (password.length < 6) {
      e.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (password !== confirmPassword) {
      e.confirmPassword = "Las contraseñas no coinciden.";
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
          const response = await api<LoginResponse>("/auth/register", {
            method: "POST",
            withAuth: false,
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              password,
            }),
          });
        
          localStorage.setItem("token", response.token);
        
          onRegister({
            name: name.trim(),
            email: email.trim(),
          });
        } catch (caughtError: unknown) {
          if (caughtError instanceof ApiError) {
            switch (caughtError.status) {
              case 400:
                setErrors({
                  general: "Revisa que los datos ingresados sean válidos.",
                });
                break;
              
              case 409:
                setErrors({
                  email: "Ya existe una cuenta registrada con este correo.",
                });
                break;
              
              default:
                setErrors({
                  general: "No fue posible crear la cuenta. Inténtalo nuevamente.",
                });
            }
          } else {
            setErrors({
              general: "No fue posible crear la cuenta. Inténtalo nuevamente.",
            });
          }
        } finally {
          setIsLoading(false);
        }
  };

  const clearError = (field: string) => {
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center mb-4 shadow-sm">
            <CheckSquare size={20} className="text-white" />
          </div>
          <h1 className="text-[#1a1a2e] mb-1">Crear cuenta</h1>
          <p className="text-[#6b7280] text-sm">Únete para empezar a organizar tus tareas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#374151]">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                placeholder="Tu nombre"
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#f9fafb] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:ring-2 transition-all text-sm ${
                  errors.name
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-[#e5e7eb] focus:border-[#2563EB] focus:ring-[#2563EB]/10"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Correo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#374151]">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                placeholder="tu@correo.com"
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#f9fafb] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:ring-2 transition-all text-sm ${
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-[#e5e7eb] focus:border-[#2563EB] focus:ring-[#2563EB]/10"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#374151]">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError("password"); clearError("confirmPassword"); }}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border bg-[#f9fafb] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:ring-2 transition-all text-sm ${
                    errors.password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[#e5e7eb] focus:border-[#2563EB] focus:ring-[#2563EB]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}

              {/* Indicador de fortaleza */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-0.5">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= level * 3
                          ? level === 1 ? "bg-red-400" : level === 2 ? "bg-yellow-400" : "bg-green-400"
                          : "bg-[#e5e7eb]"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-[#9ca3af] ml-1">
                    {password.length < 4 ? "Débil" : password.length < 7 ? "Media" : "Fuerte"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#374151]">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                  placeholder="Repite tu contraseña"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border bg-[#f9fafb] text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none focus:ring-2 transition-all text-sm ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : confirmPassword && password === confirmPassword
                      ? "border-green-400 focus:border-green-400 focus:ring-green-100"
                      : "border-[#e5e7eb] focus:border-[#2563EB] focus:ring-[#2563EB]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {errors.general && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {errors.general}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-2.5 rounded-lg transition-all text-sm mt-1 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-sm text-[#6b7280] text-center mt-5">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={onGoToLogin}
              className="text-[#2563EB] hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}