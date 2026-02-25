import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAuth from "../../api/apiAuth";


export default function RegisterPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const [name, setName] = useState('')
  const [academy, setAcademy] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await apiAuth.post("/auth/register-adm", {
        name,
        email,
        password,
        role: "ADMIN",
        nameAcademia: academy,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/", { replace: true });
        return;
      }

      navigate("/login");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert("E-mail já cadastrado.");
      } else {
        alert("Erro ao registrar usuário.");
      }
    }
  }

  function handleNext() {
    setStep((prev) => prev + 1)
  }

  function handleBack() {
    setStep((prev) => prev - 1)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-xl bg-black rounded-2xl shadow-xl px-12 py-12">

        <h1 className="text-3xl font-semibold mb-8">
          Cadastro
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block mb-2 text-sm">Nome</label>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Nome da Academia </label>
                <p className="mb-2 text-xs text-neutral-400">
                  Exemplo: Trinity Jiu-Jitsu
                </p>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                  value={academy}
                  onChange={(e) => setAcademy(e.target.value)}
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-500"
              >
                Prosseguir
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block mb-2 text-sm">E-mail</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full rounded-xl border border-neutral-600 py-3"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-500"
                >
                  Prosseguir
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div>
                <label className="block mb-2 text-sm">Senha</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Confirmar Senha</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full rounded-xl border border-neutral-600 py-3"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-500"
                >
                  Finalizar Cadastro
                </button>
              </div>
            </>
          )}

        </form>
      </div>
    </div>
  )
}