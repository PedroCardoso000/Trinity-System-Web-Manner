import type { Faixa } from "./Faixa"

type Student = {
    id: number
    nome: string
    email: string
    telefone?: string
    anoInicioNaTrinity?: number
    faixa: Faixa
    quantidadeGraus?: number
    ativo: boolean
    userId?: number
    branchId: number
}

export type { Student }
