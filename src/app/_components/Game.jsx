'use client'
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

export default function Game({ listaBandeiras = [] }) {
  const lista = listaBandeiras.listaBandeiras || listaBandeiras || []

  const [currentBandeira, setCurrentBandeira] = useState(null)
  const [pontos, setPontos] = useState(0)
  const [erros, setErros] = useState(0)
  const [respostaCerta, setRespostaCerta] = useState(null)
  const [respostaSelecionada, setRespostaSelecionada] = useState(null)
  const [bloqueado, setBloqueado] = useState(false)
  const [mounted, setMounted] = useState(false)

  
  const [usedCodes, setUsedCodes] = useState([])
  const usedCodesRef = useRef([])
  useEffect(() => { usedCodesRef.current = usedCodes }, [usedCodes])

  const [acabou, setAcabou] = useState(false)

  useEffect(() => setMounted(true), [])

  
  const sortearPergunta = useCallback(() => {
    if (!lista || lista.length === 0) {
      setCurrentBandeira(null)
      setRespostaCerta(null)
      return
    }


    
    const disponiveis = lista.filter(b => !usedCodesRef.current.includes(b.code))
    const pool = disponiveis.length > 0 ? disponiveis : lista

    
    const r = Math.floor(Math.random() * pool.length)
    const novo = pool[r]

    
    setUsedCodes(prev => {
      if (prev.includes(novo.code)) {
        if (prev.length >= lista.length) {
          setAcabou(true)
        }
        return prev
      }
      const newUsed = [...prev, novo.code]
      usedCodesRef.current = newUsed // sincroniza ref imediatamente
      return newUsed
    })

    
    setCurrentBandeira(novo)
    setRespostaCerta(novo?.name)
    setRespostaSelecionada(null)
    setBloqueado(false)
  }, [lista])

 
  useEffect(() => {
    if (mounted && !acabou) sortearPergunta()
  }, [mounted])

  
  const opcoes = useMemo(() => {
    if (!currentBandeira || !lista || lista.length === 0) return []
    const copia = lista.filter(b => b.code !== currentBandeira.code)
    const embaralhada = [...copia].sort(() => Math.random() - 0.5)
    const erradas = embaralhada.slice(0, 3)
    const todasOpcoes = [...erradas, currentBandeira]
    return [...todasOpcoes].sort(() => Math.random() - 0.5)
  }, [currentBandeira, lista])

  function verificarResposta(op) {
    if (bloqueado || acabou) return
    setBloqueado(true)
    setRespostaSelecionada(op.name)

    const acertou = op.name === respostaCerta
    if (acertou) setPontos(p => p + 1)
    else setErros(e => e + 1)

    const isUltima = usedCodesRef.current.length === lista.length

    setTimeout(() => {
      setRespostaSelecionada(null)
     
      if(isUltima){
        setAcabou(true)
        return
      }

      sortearPergunta()
     
    }, 1000)
  }

  function reiniciar() {
    setPontos(0)
    setErros(0)
    setRespostaSelecionada(null)
    setBloqueado(false)
    setUsedCodes([])
    usedCodesRef.current = []
    setAcabou(false)
    setTimeout(() => sortearPergunta(), 50)
  }

    if(acabou){
        return(
        <div className="flex flex-col items-center gap-4 mt-10">
      <h2 className="text-2xl font-bold">🎉 Você completou o jogo!</h2>
      <p>Acertos: <strong>{pontos}</strong></p>
      <p>Erros: <strong>{erros}</strong></p>

      <button
        onClick={reiniciar}
        className="bg-green-700 px-6 py-2 rounded-md font-semibold"
      >
        Jogar novamente
      </button>
    </div>
      )
    }

  return (
    

    <div className="text-white flex flex-col justify-center items-center mb-10">

     
      
      <div className="mt-2 flex justify-center items-center mb-8 gap-5">
        
        <div className='flex gap-2 flex-col lg:flex-row'>
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

      <div className="relative flex justify-center mt-2 mb-6">
        {currentBandeira?.flag ? (
          <Image 
            src={currentBandeira.flag} 
            width={300} 
            height={200} 
            alt="bandeira" 
            style={{objectFit: 'contain'}} 
          />
        ) : (
          <div className="w-[300px] h-[200px] bg-gray-700 flex items-center justify-center rounded">Sem bandeira</div>
        )}
      </div>

      <div className="mb-5 mt-[-5px] text-sm text-gray-300">
        {lista.length > 0 && <span>{usedCodes.length} / {lista.length} Países</span>}
      </div>

     
        <div className="flex flex-col justify-center items-center">
          
          <div className="flex gap-4 flex-col lg:flex-row justify-center items-center font-medium font-elms">
            {opcoes.map((op, index) => {
              const selecionada = respostaSelecionada === op.name
              const correta = respostaCerta === op.name

              let className = "w-50 p-2 rounded-xl bg-gray-800 hover:scale-[1.05] transition border border-gray-600 text-center cursor-pointer"
              if (respostaSelecionada) {
                if (correta) className += " bg-green-700"
                else if (selecionada && !correta) className += " bg-red-700"
                else className += " opacity-60"
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
