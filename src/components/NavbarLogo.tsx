import UserButton from '@/modules/auth/components/UserButton';
import Image from 'next/image';
import React from 'react'

export default function NavbarLogo() {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-2">
        <Image src={"/logo.svg"} alt="jira" width={38} height={38} />
        <h1 className="font-semibold text-2xl">Jira</h1>
      </div>
      <UserButton />
    </nav>
  );
}
