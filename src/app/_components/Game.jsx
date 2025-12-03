'use client'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function Game({ listaBandeiras = [] }) {
  // normaliza prop (caso venha dentro de um objeto)
  const lista = listaBandeiras.listaBandeiras || listaBandeiras || []

  // estado
  const [currentBandeira, setCurrentBandeira] = useState(null)
  const [pontos, setPontos] = useState(0)
  const [erros, setErros] = useState(0)
  const [respostaCerta, setRespostaCerta] = useState(null)
  const [respostaSelecionada, setRespostaSelecionada] = useState(null)
  const [bloqueado, setBloqueado] = useState(false)
  const [mounted, setMounted] = useState(false)

  // marca que o componente já montou — tudo que usa Math.random só depois disso
  useEffect(() => {
    setMounted(true)
  }, [])

  // função para sortear uma nova bandeira — sempre no cliente
  const sortearPergunta = useCallback(() => {
    if (!lista || lista.length === 0) {
      setCurrentBandeira(null)
      setRespostaCerta(null)
      return
    }

    const r = Math.floor(Math.random() * lista.length)
    const novo = lista[r]

    setCurrentBandeira(novo)
    setRespostaCerta(novo?.name)
    setRespostaSelecionada(null)
    setBloqueado(false)
  }, [lista])

  // ao montar, sorteia a primeira pergunta
  useEffect(() => {
    if (mounted) {
      sortearPergunta()
    }
  }, [mounted, sortearPergunta])

  // cria opções sem mutar o array original
  const opcoes = useMemo(() => {
    if (!currentBandeira || !lista || lista.length === 0) return []

    // cópia para não mutar o original e remove a correta
    const copiaArray = lista.filter((b) => b.code !== currentBandeira.code)

    // Embaralha a cópia
    const embaralhada = [...copiaArray].sort(() => Math.random() - 0.5)

    // Pega 3 erradas
    const erradas = embaralhada.slice(0, 3)

    // Junta as 3 erradas com a correta e embaralha
    const todasOpcoes = [...erradas, currentBandeira]
    return [...todasOpcoes].sort(() => Math.random() - 0.5)
  }, [currentBandeira, lista])

  function verificarResposta(op) {
    if (bloqueado) return
    setBloqueado(true)
    setRespostaSelecionada(op.name)

    const acertou = op.name === respostaCerta
    if (acertou) {
      setPontos((p) => p + 1)
    } else {
      setErros((e) => e + 1)
    }

    setTimeout(() => {
      setRespostaSelecionada(null)
      sortearPergunta()
    }, 2000)
  }

  function reiniciar() {
    setPontos(0)
    setErros(0)
    setRespostaSelecionada(null)
    setBloqueado(false)
    sortearPergunta()
  }

  return (
    <div className="text-white flex flex-col justify-center items-center mb-10">
     
      <div className="mt-2 flex justify-center items-center mb-8 gap-5">
        <div className='flex gap-2 lg:flex-row flex-col'>
          <div className="flex justify-center items-center">
            <p className="text-[1.2rem] border-3 border-green-800 bg-white text-center text-gray-800 py-1 p-2 w-35 rounded-md font-bold font-dosis">
              Acertos : <span className="text-green-900">{pontos}</span>
            </p>
          </div>
        
          <div className="flex justify-center items-center">
             <p className="text-[1.2rem] border-3 border-red-800 bg-white text-center text-gray-800 py-1 p-2 w-35 rounded-md font-bold font-dosis">
              Erros : <span className="text-red-900">{erros}</span>
             </p>
          </div>
        </div>

        
        <button onClick={reiniciar} className="bg-green-800 hover:scale-[1.05] text-center p-2 rounded-md w-40 font-dosis font-semibold">
          Reiniciar
        </button>
      </div>

      <div className="relative flex justify-center mt-7 mb-8">
        {currentBandeira?.flag ? (
          <Image src={currentBandeira.flag} width={300} height={200} alt="bandeira" style={{ objectFit: 'contain' }} />
        ) : (
          <div className="w-[300px] h-[200px] bg-gray-700 flex items-center justify-center rounded">Sem bandeira</div>
        )}
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="flex gap-4 flex-col lg:flex-row justify-center items-center font-medium font-elms">
         
          {opcoes.map((op, index) => {
            const selecionada = respostaSelecionada === op.name
            const correta = respostaCerta === op.name

            let className = "w-50 p-2 rounded-xl bg-gray-800 hover:scale-[1.05] transition border border-gray-600 text-center cursor-pointer"
           
            if (respostaSelecionada) {
              if (correta) {
                className += " bg-green-700"
              } else if (selecionada && !correta) {
                className += " bg-red-700"
              } else {
                className += " opacity-60"
              }
            }

            return (
              <button key={index} onClick={() => verificarResposta(op)} disabled={bloqueado} className={className}>
                {op.name}
              </button>
            )
          })}

        </div>
      </div>
    </div>
  )
}
