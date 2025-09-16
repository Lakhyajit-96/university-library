"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";
import UserProfileSection from "@/components/UserProfileSection";

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex justify-between items-center gap-5">
      {/* Left side - Logo and Brand */}
      <Link href="/" className="flex items-center gap-3">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        <h1 className="text-2xl font-semibold text-white">LearnWise</h1>
      </Link>

      {/* Right side - Navigation and User */}
      <div className="flex items-center gap-8">
        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`transition-colors ${
              pathname === "/" 
                ? "text-primary font-semibold" 
                : "text-white hover:text-gray-300"
            }`}
          >
            Home
          </Link>
          <Link 
            href="/search" 
            className={`transition-colors ${
              pathname === "/search" 
                ? "text-primary font-semibold" 
                : "text-white hover:text-gray-300"
            }`}
          >
            Search
          </Link>
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <UserProfileSection session={session} />
          
          {/* Logout Button */}
          <form action={signOutAction}>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Image src="/icons/logout.svg" alt="logout" width={16} height={16} />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
