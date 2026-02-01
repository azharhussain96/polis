import { initTRPC, TRPCError } from '@trpc/server';
import { cookies } from 'next/headers';
import superjson from 'superjson';

export const createTRPCContext = async () => {
  const cookieStore = await cookies();
  const captchaSession = cookieStore.get('captcha_verified');

  return {
    isHumanVerified: !!captchaSession,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Procedure that requires CAPTCHA verification
export const humanProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.isHumanVerified) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'CAPTCHA required' });
  }
  return next({ ctx });
});
