// src/constants/links.ts
import { NavLink } from "../types/NavLinkProps";

export const navigationLinks: NavLink[] = [
  { label: "Home", href: "/", isAdminPage: false },
  // { label: "About Me", href: "/about" },
  // { label: "Articles", href: "/articles" },
  // { label: "Categories", href: "/categories" },
  { label: "About Me", href: "/commingsoon", isAdminPage: false },
  { label: "Articles", href: "/commingsoon", isAdminPage: false },
  { label: "Categories", href: "/commingsoon", isAdminPage: false },
  { label: "login", href: "/login", isAdminPage: false },
  { label: "Admin Dashborad", href: "/admin", isAdminPage: true },
];
