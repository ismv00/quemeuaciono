import { plantoes } from '@/src/data/plantoes';
import { ListaAnalistas } from '@/src/components/ListaAnalistas';
import { Header } from '@/src/components/Header';
import { InfoBlocks } from '@/src/components/InfoBlocks';
import { CalendarioPlantoes } from '@/src/components/CalendarioPlantoes';

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Header />
      <InfoBlocks />
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analista de Plantão</h1>
        <p className="mt-2 text-sm text-gray-600">Escala de plantão - finais de semana</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-3">
        <CalendarioPlantoes />
        <div className="lg:col-span-2 space-y-10">
          {plantoes.map((plantao) => (
            <section key={plantao.data}>
              <h2 className="mb-4 text-lg font-medium text-gray-800">
                {new Date(plantao.data).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                })}
              </h2>

              <ListaAnalistas analistas={plantao.analistas} />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
