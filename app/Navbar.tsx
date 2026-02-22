'use client'

import { Player } from '@/generated/prisma/client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { AuthProviders } from './lib/AuthProviders';
import { useRouter } from 'next/navigation';
import { DeleteSession } from './services/application.service';

const Navbar = ({ loggedInPlayer }: { loggedInPlayer: Player | undefined }) => {

  const router = useRouter();

  async function handleLogout() {
    await DeleteSession();

    router.refresh();
  }

  function handleLogIn() {
    signIn(AuthProviders.Google);
  }

  //IMPLEMENT MENU FOR MOBILE
  return (
    <nav className="w-full px-6 lg:px-16">
      <div className="flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-rose-500">
          BSG-XI
        </Link>

        <div className="flex gap-3">
          <Link href="/" className="hover:text-blue-500 font-medium">
            Home
          </Link>

          <Link href="/stats" className="hover:text-blue-500 font-medium">
            Stats
          </Link>

          {loggedInPlayer?.is_admin && (
            <Link href="/admin" className="hidden md:block hover:text-blue-500 font-medium">
              Admin
            </Link>
          )}

          <Link href="/about" className="hover:text-blue-500 font-medium">
            About
          </Link>

          {loggedInPlayer && (
            <button
              onClick={handleLogout}
              className="hover:text-red-500 font-medium"
            >
              Logout
            </button>
          )}

          {!loggedInPlayer && (
            <button
              onClick={handleLogIn}
              className="hover:text-blue-500 font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
