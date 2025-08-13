import React from "react";
import Link from "next/link";
import { mainNavigation } from "../../../links";

const ContactRow = ({ Icon, title, children }) => (
  <div className="flex items-start gap-3">
    <div className="shrink-0 rounded-xl bg-white/15 p-2">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <div className="font-semibold text-white">{title}</div>
      <div className="text-white/90 text-sm">{children}</div>
    </div>
  </div>
);

// simple inline icons
const PinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" {...props}>
    <path d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z" stroke="currentColor" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" />
  </svg>
);
const PhoneIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" {...props}>
    <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.7 19.7 0 0 1-8.63-3.07 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.08 4.2 2 2 0 0 1 4.06 2h2a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.61a2 2 0 0 1-.45 2.11L7.1 9.76a16 16 0 0 0 7.14 7.14l1.32-1.13a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0 1 22 16.92Z" stroke="currentColor"/>
  </svg>
);
const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" />
    <path d="m3 7 9 6 9-6" stroke="currentColor" />
  </svg>
);

const services = [
  "Business Registration",
  "Check Name",
  "Track Registration Progress",
  "Downloadable forms",
  "Chat with Our Virtual Assistant",
];

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#5252C9" }}>
      <div className="body-content py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-40 text-white/90">
          {/* Contact */}
          <div className="space-y-6">
            <ContactRow Icon={PinIcon} title="Find us">
              No 36, Main Street, Colombo 1
            </ContactRow>
            <ContactRow Icon={PhoneIcon} title="Call us">
              +94 11 123 5467
            </ContactRow>
            <ContactRow Icon={MailIcon} title="Mail us">
              info@registrar.gov.lk
            </ContactRow>
          </div>

          {/* Services (plain text) */}
          <div>
            <div className="uppercase tracking-wide text-white/90 text-xs font-semibold mb-4">
              Services
            </div>
            <ul className="space-y-2">
              {services.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <div className="uppercase tracking-wide text-white/90 text-xs font-semibold mb-4">
              Useful Links
            </div>
            <ul className="space-y-2">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:underline underline-offset-4"
                  >
                    {item["route-name"]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="h-[3px] w-full bg-indigo-700/40" />
    </footer>
  );
};

export default Footer;
