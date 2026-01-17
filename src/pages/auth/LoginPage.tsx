import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  // const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      // await login(email, password)
      navigate('/', { replace: true })
    } catch {
      setError('Não foi possível entrar. Verifique suas credenciais.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-xl bg-black rounded-2xl shadow-xl px-12 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Trinity Jiu-Jitsu
          </h1>
          <p className="mt-2 text-neutral-300 text-sm">
            Sistema de gerenciamento para professores e administradores
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-200 mb-2"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="
                w-full
                rounded-xl
                border border-neutral-700
                bg-black
                px-4 py-3.5
                text-base
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
              "
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-200 mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="
                w-full
                rounded-xl
                border border-neutral-700
                bg-black
                px-4 py-3.5
                text-base
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
              "
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-900/20 border border-red-600 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="
              w-full
              h-13
              rounded-xl
              bg-red-600
              text-white
              text-base font-semibold
              hover:bg-red-500
              transition-colors
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
