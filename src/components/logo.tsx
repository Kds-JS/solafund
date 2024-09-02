import Image from 'next/image';
import React from 'react';

export const Logo = () => {
  return (
    <>
      <Image
        src="/logo-white.png"
        height={24}
        width={24}
        alt="LOGO"
        className="hidden dark:block"
      />
      <Image
        src="/logo-black.png"
        height={24}
        width={24}
        alt="LOGO"
        className="dark:hidden"
      />
    </>
  );
};
