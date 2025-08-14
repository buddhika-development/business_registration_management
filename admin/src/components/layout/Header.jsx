"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../ui/Logo";

const Header = () => {
  const profile = {
    name: "Nadeemall Gamage",
    role: "Registrar officer",
    avatar: "/officer.jpg",
  };

  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // close on click-outside + Esc
  useEffect(() => {
    const onClickAway = (e) => {
      if (!menuRef.current || !triggerRef.current) return;
      const t = e.target;
      if (!menuRef.current.contains(t) && !triggerRef.current.contains(t)) {
        setOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm h-[80px] w-full">
      <div className="body-content flex h-full items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Profile (unchanged visually) + dropdown */}
        <div className="relative">
          <div className="flex items-center">
            <div
              ref={triggerRef}
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="profile-menu"
              className="flex items-center gap-3"
            >
              {/* profile details section (unchanged) */}
              <div className="leading-tight flex flex-col items-end">
                <div className="font-semibold">{profile.name}</div>
                <div className="text-sm">{profile.role}</div>
              </div>

              {/* profile image section (unchanged) */}
              <Image
                src={profile.avatar}
                alt=""
                width={100}
                height={100}
                className="rounded-full w-[50px] h-[50px] object-cover"
                priority
              />
            </div>
          </div>

          {open && (
            <div
              id="profile-menu"
              role="menu"
              ref={menuRef}
              className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-lg ring-1 ring-gray-200 py-2"
            >
              <Link
                href="/signup"
                role="menuitem"
                className="block px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
