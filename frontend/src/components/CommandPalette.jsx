import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { LayoutDashboard, ListTodo, CalendarDays, User2, Plus, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function CommandPalette({ open, onOpenChange, onNewTask }) {
  const nav = useNavigate();
  const { toggle: toggleTheme, theme } = useTheme();
  const { logout } = useAuth();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const run = (fn) => {
    onOpenChange(false);
    setTimeout(fn, 10);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." data-testid="cmdk-input" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(onNewTask)} data-testid="cmdk-new-task">
            <Plus className="h-4 w-4 mr-2" /> New task
            <kbd className="ml-auto font-mono text-[10px] bg-secondary rounded px-1.5 py-0.5">N</kbd>
          </CommandItem>
          <CommandItem onSelect={() => run(toggleTheme)} data-testid="cmdk-toggle-theme">
            {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            Toggle theme
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => nav("/dashboard"))} data-testid="cmdk-go-dashboard">
            <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => run(() => nav("/tasks"))} data-testid="cmdk-go-tasks">
            <ListTodo className="h-4 w-4 mr-2" /> Tasks
          </CommandItem>
          <CommandItem onSelect={() => run(() => nav("/calendar"))} data-testid="cmdk-go-calendar">
            <CalendarDays className="h-4 w-4 mr-2" /> Calendar
          </CommandItem>
          <CommandItem onSelect={() => run(() => nav("/you"))} data-testid="cmdk-go-you">
            <User2 className="h-4 w-4 mr-2" /> You
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Session">
          <CommandItem onSelect={() => run(() => { logout(); nav("/login"); })} data-testid="cmdk-logout">
            <LogOut className="h-4 w-4 mr-2" /> Log out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
