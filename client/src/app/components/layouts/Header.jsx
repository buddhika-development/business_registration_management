"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../ui/Logo";
import { mainNavigation } from "../../../../links";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm h-[80px] w-full">
      <div className="body-content flex h-full items-center justify-between">

        {/* =================================== */}
        {/* Logo */}
        {/* =================================== */}
        <div className="flex items-center">
          <Logo />
        </div>


        {/* =================================== */}
        {/* Desktop nav */}
        {/* =================================== */}
        <nav className="hidden lg:flex h-full items-stretch gap-6">
          {mainNavigation.map((nav) => (
              <Link
              key={nav.href}
              href={nav.href}
              className="relative group flex items-center px-1"
              >
              <span className="relative z-10">{nav["route-name"]}</span>
              <span
                className="
                pointer-events-none absolute bottom-[10px] left-0 h-[3px] w-0
                bg-blue-600 transition-all duration-300 ease-in-out
                group-hover:w-full
                "
                />
            </Link>
          ))}
        </nav>


        {/* =================================== */}
        {/* Mobile hamburger */}
        {/* =================================== */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
          >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* =================================== */}
      {/* Mobile menu */}
      {/* =================================== */}
      <div
        className={[
          "lg:hidden absolute inset-x-0 top-[80px] origin-top bg-white shadow-md border-t",
          "transition-all duration-200 ease-out",
          open ? "opacity-100 scale-y-100" : "pointer-events-none opacity-0 scale-y-95",
        ].join(" ")}
      >
        <nav className="body-content py-2">
          <ul className="flex flex-col">
            {mainNavigation.map((nav) => (
              <li key={nav.href}>
                <Link
                  href={nav.href}
                  onClick={() => setOpen(false)}
                  className="relative block px-2 py-3 group"
                >
                  <span className="relative z-10">{nav["route-name"]}</span>
                  <span
                    className="
                      pointer-events-none absolute left-2 bottom-0 h-[2px] w-0
                      bg-blue-600 transition-all duration-300 ease-in-out
                      group-hover:w-24
                    "
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
