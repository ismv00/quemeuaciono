import { TaskChooseOrganization } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <TaskChooseOrganization redirectUrlComplete="/" />
    </main>
  );
}
