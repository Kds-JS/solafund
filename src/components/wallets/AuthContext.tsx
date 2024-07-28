'use client';

import { SessionContext, useSession } from './sessions';

export function AuthContext({ children }: React.PropsWithChildren) {
  const sessionContext = useSession();

  return (
    <SessionContext.Provider value={sessionContext}>
      {children}
    </SessionContext.Provider>
  );
}
