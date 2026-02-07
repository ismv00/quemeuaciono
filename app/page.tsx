import { Header } from '@/src/components/Header';
import { InfoBlocks } from '@/src/components/InfoBlocks';
import { HomeClient } from '@/src/components/HomeClient';
import { AnimatedSection } from '@/src/components/AnimatedSection';
import { fetchPlantoes } from '@/src/services/fetchPlantoes';

export default async function Home() {
  const plantoes = await fetchPlantoes();

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <AnimatedSection>
        <Header />
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <InfoBlocks />
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <HomeClient plantoes={plantoes} />
      </AnimatedSection>
    </main>
  );
}
