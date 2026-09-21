import { clerkMiddleware } from '@clerk/nextjs/server';

// A checagem de autenticação em si vive em cada recurso (layout/página),
// via `auth.protect()` — ver src/lib/empresa-atual.ts. `createRouteMatcher`
// para gate de rota no middleware foi descontinuado pelo Clerk: middleware
// pode ser contornado por Server Functions e por divergências de path
// entre o Clerk e o framework, então checagem por recurso é a defesa real.
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
