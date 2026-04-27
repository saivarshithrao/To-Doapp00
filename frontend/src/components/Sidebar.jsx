import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ListTodo, CalendarDays, User2, ShieldCheck, Plus, Command } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
  { to: "/tasks", label: "Tasks", icon: ListTodo, testid: "nav-tasks" },
  { to: "/calendar", label: "Calendar", icon: CalendarDays, testid: "nav-calendar" },
  { to: "/you", label: "You", icon: User2, testid: "nav-you" },
];

export default function Sidebar({ onNewTask, onOpenCommand }) {
  const { user } = useAuth();
  const nav = useNavigate();
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-card/40 h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg tracking-tight">Vault<span className="text-primary">Do</span></span>
      </div>

      <div className="p-3">
        <Button onClick={onNewTask} className="w-full gap-2 justify-start" data-testid="sidebar-new-btn">
          <Plus className="h-4 w-4" /> New Task
        </Button>
        <button
          onClick={onOpenCommand}
          className="w-full mt-2 flex items-center justify-between text-xs text-muted-foreground px-3 py-2 rounded-md border border-border hover:border-primary/40 hover:text-foreground transition-colors"
          data-testid="sidebar-cmdk-btn"
        >
          <span className="flex items-center gap-2"><Command className="h-3.5 w-3.5" /> Quick search</span>
          <kbd className="font-mono text-[10px] bg-secondary rounded px-1.5 py-0.5">⌘K</kbd>
        </button>
      </div>

      <nav className="px-3 space-y-1 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-3 py-2">Workspace</span>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            data-testid={l.testid}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`
            }
          >
            <l.icon className="h-4 w-4" />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => nav("/you")}
          className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors"
          data-testid="sidebar-profile"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
