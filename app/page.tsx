import { Header } from '@/src/components/Header';
import { InfoBlocks } from '@/src/components/InfoBlocks';
import { HomeClient } from '@/src/components/HomeClient';
import { fetchPlantoes } from '@/src/services/fetchPlantoes';

export default async function Home() {
  const plantoes = await fetchPlantoes();

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <Header />
      <InfoBlocks />

      <HomeClient plantoes={plantoes} />
    </main>
  );
}
