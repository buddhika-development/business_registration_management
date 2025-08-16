"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../ui/Logo";
import { mainNavigation } from "../../../links";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { status, logout } = useAuth();
  const isAuthed = status === "authenticated";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // base navigation (without login)
  const navLinks = mainNavigation.filter(
    (item) => item["route-name"] !== "Login"
  );

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm h-[80px] w-full">
      <div className="body-content flex h-full items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex h-full items-stretch gap-6">
          {navLinks.map((nav) => {
            const active = isActive(nav.href);
            return (
              <Link
                key={nav.href}
                href={nav.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative group flex items-center px-1 font-medium",
                  active ? "text-primary" : "text-base-text",
                ].join(" ")}
              >
                <span className="relative z-10">{nav["route-name"]}</span>
                <span
                  className={[
                    "pointer-events-none absolute bottom-[10px] left-0 h-[2px]",
                    "bg-primary transition-all duration-300 ease-in-out",
                    active ? "w-full" : "w-0 group-hover:w-full",
                  ].join(" ")}
                />
              </Link>
            );
          })}

          {/* Conditional items */}
          {!isAuthed && (
            <Link
              href="/Login"
              className="relative group flex items-center px-1 font-medium text-base-text hover:text-primary"
            >
              <span className="relative z-10">Login</span>
              <span
                className="pointer-events-none absolute bottom-[10px] left-0 h-[2px] bg-primary transition-all duration-300 ease-in-out w-0 group-hover:w-full"
              />
            </Link>
          )}
          {isAuthed && (
            <>
              <Link
                href="/Appointment"
                className="relative group flex items-center px-1 font-medium text-base-text hover:text-primary"
              >
                <span className="relative z-10">Reserve a Slot</span>
                <span
                  className="pointer-events-none absolute bottom-[10px] left-0 h-[2px] bg-primary transition-all duration-300 ease-in-out w-0 group-hover:w-full"
                />
              </Link>
              <button
                onClick={logout}
                className="relative group flex items-center px-1 font-medium text-base-text hover:text-red-500"
              >
                <span className="relative z-10">Logout</span>
                <span
                  className="pointer-events-none absolute bottom-[10px] left-0 h-[2px] bg-red-500 transition-all duration-300 ease-in-out w-0 group-hover:w-full"
                />
              </button>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={[
          "lg:hidden absolute inset-x-0 top-[80px] origin-top bg-white shadow-md border-t",
          "transition-all duration-200 ease-out",
          open
            ? "opacity-100 scale-y-100"
            : "pointer-events-none opacity-0 scale-y-95",
        ].join(" ")}
      >
        <nav className="body-content py-2">
          <ul className="flex flex-col">
            {navLinks.map((nav) => {
              const active = isActive(nav.href);
              return (
                <li key={nav.href}>
                  <Link
                    href={nav.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "relative block px-2 py-3 group font-medium",
                      active ? "text-primary" : "text-base-text",
                    ].join(" ")}
                  >
                    <span className="relative z-10">{nav["route-name"]}</span>
                    <span
                      className={[
                        "pointer-events-none absolute left-2 bottom-0 h-[2px]",
                        "bg-primary transition-all duration-300 ease-in-out",
                        active ? "w-24" : "w-0 group-hover:w-24",
                      ].join(" ")}
                    />
                  </Link>
                </li>
              );
            })}

            {/* Conditional mobile links */}
            {!isAuthed && (
              <li>
                <Link
                  href="/Login"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-3 text-primary font-medium"
                >
                  Login
                </Link>
              </li>
            )}
            {isAuthed && (
              <>
                <li>
                  <Link
                    href="/Appointment"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-3 text-base-text hover:text-primary font-medium"
                  >
                    Reserve a Slot
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-2 py-3 text-red-500 font-medium hover:text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
