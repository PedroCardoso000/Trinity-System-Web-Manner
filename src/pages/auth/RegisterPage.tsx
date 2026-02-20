import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const [name, setName] = useState('')
  const [academy, setAcademy] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleNext() {
    setStep((prev) => prev + 1)
  }

  function handleBack() {
    setStep((prev) => prev - 1)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.')
      return
    }

    console.log({
      name,
      academy,
      email,
      phone,
      password,
    })

    navigate('/')
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
                <label className="block mb-2 text-sm">Nome da Academia</label>
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

              <div>
                <label className="block mb-2 text-sm">Telefone</label>
                <input
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:ring-2 focus:ring-red-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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