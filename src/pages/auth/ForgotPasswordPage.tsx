import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSend() {
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-xl bg-black rounded-2xl shadow-xl px-12 py-12">

        <h1 className="text-3xl font-semibold mb-8">
          Recuperar senha
        </h1>

        {!sent ? (
          <>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:ring-2 focus:ring-red-500 mb-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSend}
              className="w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-500"
            >
              Enviar
            </button>
          </>
        ) : (
          <div className="rounded-xl bg-green-900/20 border border-green-600 px-4 py-4">
            <p className="text-green-400 text-sm">
              Um link de recuperação foi enviado para o e-mail: <strong>{email}</strong>
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/login')}
          className="mt-6 text-neutral-400 hover:text-white text-sm"
        >
          Voltar para login
        </button>

      </div>
    </div>
  )
}