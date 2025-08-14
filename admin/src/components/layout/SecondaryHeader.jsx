"use client";

import React from "react";
import { subHeaderNavigation } from "../../../links";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SecondaryHeader = () => {
  const pathname = usePathname();

  // Consider "/foo/bar" active for "/foo" too. Change to `pathname === href` for exact only.
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="h-[60px] bg-primary/40 w-full flex items-center">
      <div className="body-content flex gap-8">
        {subHeaderNavigation.map((nav) => {
          const active = isActive(nav.href);
          return (
            <Link
              href={nav.href}
              key={nav.href}
              aria-current={active ? "page" : undefined}
              className="
                relative h-[60px] flex items-center px-1
                text-base-text
                group
              "
            >
              {nav["route-name"]}
              <span
                className={[
                  "pointer-events-none absolute left-0 bottom-[6px] h-[3px]",
                  "bg-primary transition-all duration-300 ease-in-out",
                  active ? "w-full" : "w-0 group-hover:w-full",
                ].join(" ")}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SecondaryHeader;
