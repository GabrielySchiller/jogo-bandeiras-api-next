import Game from "./_components/Game";

export default async function Home() {

   const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2,translations,independent", { cache: "no-store" });
   const bandeiras = await res.json();

   const lista = bandeiras
    .filter(b => b.independent === true)
    .filter(b => b.flags && b.flags.svg && b.name && b.name.common && b.independent === true)
    .map(b => ({
      code: b.cca2,
      name: b.translations?.por?.common || b.name.common,
      flag: b.flags.svg || b.flags.png
    }));

    
  
  
   return (
   <div className="text-white">
    
    <div className="flex items-end mb-10 justify-between">
      
      <div className="flex gap-2">
        <img className="w-10" src='https://ik.imagekit.io/gabrielySchiller/icons8-bandeira-100.png' alt="icon bandeira"/>
        <h1 className="text-[1.6rem] font-semibold font-dosis "> Jogo das bandeiras</h1>
      </div>

      

    </div>

    <main className="flex justify-center items-center flex-col" >
      <div className="mb-4 font-dosis font-bold">
        <h2 className="text-[1.6rem] tracking-wider">Acerte o país pela bandeira:</h2>
      </div>

      <Game  listaBandeiras={lista}/>

     
    </main>
   </div>
  );
}
