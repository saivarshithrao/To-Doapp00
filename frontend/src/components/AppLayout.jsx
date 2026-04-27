import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import TodoFormDialog from "./TodoFormDialog";
import CommandPalette from "./CommandPalette";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Settings, Command, Menu } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

const AppContext = createContext(null);
export const useAppCtx = () => useContext(AppContext);

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [todoDialog, setTodoDialog] = useState({ open: false, initial: null });
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [todosRefreshKey, setTodosRefreshKey] = useState(0);
  const refreshTodos = () => setTodosRefreshKey((k) => k + 1);

  const openCreate = (initial = null) => setTodoDialog({ open: true, initial });
  const closeDialog = (open) => setTodoDialog((d) => ({ ...d, open }));

  const saveTodo = async (payload) => {
    try {
      if (todoDialog.initial) {
        await api.patch(`/todos/${todoDialog.initial.id}`, payload);
        toast.success("Task updated");
      } else {
        await api.post("/todos", payload);
        toast.success("Task created");
      }
      refreshTodos();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Save failed");
    }
  };

  return (
    <AppContext.Provider value={{ openCreate, refreshTodos, todosRefreshKey }}>
      <div className="flex min-h-screen bg-background">
        <Sidebar onNewTask={() => openCreate(null)} onOpenCommand={() => setCmdkOpen(true)} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
            <div className="h-16 px-4 md:px-8 flex items-center justify-between gap-4">
              <button
                onClick={() => setCmdkOpen(true)}
                className="flex-1 max-w-md flex items-center justify-between text-sm text-muted-foreground px-3 py-1.5 rounded-md border border-border hover:border-primary/40 hover:text-foreground transition-colors"
                data-testid="topbar-cmdk"
              >
                <span className="flex items-center gap-2"><Command className="h-3.5 w-3.5" /> Search or jump to...</span>
                <kbd className="font-mono text-[10px] bg-secondary rounded px-1.5 py-0.5">⌘K</kbd>
              </button>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2" data-testid="user-menu-btn">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="hidden sm:inline text-sm">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => nav("/you")} data-testid="menu-you">
                        <Settings className="h-4 w-4 mr-2" /> Profile & Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => { logout(); nav("/login"); }} data-testid="menu-logout">
                        <LogOut className="h-4 w-4 mr-2" /> Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <TodoFormDialog open={todoDialog.open} onOpenChange={closeDialog} onSubmit={saveTodo} initial={todoDialog.initial} />
      <CommandPalette open={cmdkOpen} onOpenChange={setCmdkOpen} onNewTask={() => openCreate(null)} />
    </AppContext.Provider>
  );
}
