import React from "react";
import { motion } from "framer-motion";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Pencil, Trash2, Calendar, Lock } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";

const priorityStyles = {
  high: "text-red-500 bg-red-500/10 border-red-500/20",
  medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  low: "text-sky-500 bg-sky-500/10 border-sky-500/20",
};

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const overdue = todo.due_date && !todo.completed && isPast(parseISO(todo.due_date));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group border border-border rounded-lg bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"
      data-testid={`todo-item-${todo.id}`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo)}
          className="mt-1"
          data-testid={`todo-toggle-${todo.id}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold text-base ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {todo.title}
            </h3>
            <span className={`text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded border ${priorityStyles[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
              {todo.category}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Lock className="h-3 w-3" /> AES-256
            </span>
          </div>
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? "text-muted-foreground/60 line-through" : "text-muted-foreground"}`}>
              {todo.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {todo.due_date && (
              <span className={`inline-flex items-center gap-1 text-xs ${overdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                <Calendar className="h-3 w-3" />
                {format(parseISO(todo.due_date), "MMM d, yyyy")}
                {overdue && " · overdue"}
              </span>
            )}
            {(todo.tags || []).map((t) => (
              <span key={t} className="text-xs text-primary bg-primary/10 rounded-full px-2 py-0.5">
                #{t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(todo)} data-testid={`todo-edit-${todo.id}`}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(todo)} data-testid={`todo-delete-${todo.id}`}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
