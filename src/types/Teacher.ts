import type { Faixa } from "./Faixa"

type Teacher = {
    id: number
    nome: string
    email: string
    telefone?: string
    faixa: Faixa
    quantidadeGraus?: number
    ativo: boolean
    branchId: number
}


export type { Teacher }