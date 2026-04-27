import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const defaultForm = {
  title: "",
  description: "",
  due_date: "",
  priority: "medium",
  category: "General",
  tags: "",
};

export default function TodoFormDialog({ open, onOpenChange, onSubmit, initial }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        due_date: initial.due_date ? initial.due_date.slice(0, 10) : "",
        priority: initial.priority || "medium",
        category: initial.category || "General",
        tags: (initial.tags || []).join(", "),
      });
    } else {
      setForm(defaultForm);
    }
  }, [initial, open]);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
        priority: form.priority,
        category: form.category || "General",
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="todo-form-dialog">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs doing?" data-testid="todo-title-input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Details (encrypted at rest)..." data-testid="todo-desc-input" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="due">Due Date</Label>
              <Input id="due" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} data-testid="todo-due-input" />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger data-testid="todo-priority-trigger"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cat">Category</Label>
              <Input id="cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Work, Personal..." data-testid="todo-category-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma)</Label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="urgent, ops" data-testid="todo-tags-input" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} data-testid="todo-cancel-btn">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.title.trim()} data-testid="todo-save-btn">
            {saving ? "Saving..." : initial ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
