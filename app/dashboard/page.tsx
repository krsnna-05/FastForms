"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";

interface Form {
  id: string | number;
  title: string;
  created?: string;
  createdAt?: string;
  lastUpdated?: string;
  updatedAt?: string;
}

const DashBoard = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("/api/forms", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setForms(data);
        } else {
          setForms([]);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleCreateForm = async () => {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const newForm = await response.json();
        setForms([newForm, ...forms]);
      } else {
        console.error("Failed to create form");
      }
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const handleDeleteForm = async (id: string | number) => {
    try {
      const response = await fetch(`/api/forms?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setForms(forms.filter((f) => f.id !== id));
      } else {
        console.error("Failed to delete form");
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="pt-24 pb-12 px-4 md:px-8 min-h-screen bg-background to-muted/30 flex items-center justify-center">
          <p className="text-muted-foreground">Loading forms...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="pt-24 pb-12 px-4 md:px-8 min-h-screen bg-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                My Forms
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and organize your forms in one place
              </p>
            </div>
            <Button
              onClick={handleCreateForm}
              className="w-full md:w-auto gap-2"
              size="lg"
            >
              <Plus className="w-4 h-4" />
              Create New Form
            </Button>
          </div>

          {/* Forms List */}
          {forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 p-4 rounded-full bg-muted">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No forms yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Get started by creating your first form. You can use AI to help
                you build it faster.
              </p>
              <Button onClick={handleCreateForm}>Create Your First Form</Button>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              {/* List Header */}
              <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-muted/50 border-b border-border font-semibold text-sm">
                <div className="col-span-1">Form Name</div>
                <div className="col-span-1">Created</div>
                <div className="col-span-1">Last Updated</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* List Items */}
              <div className="divide-y divide-border">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="flex flex-col md:grid md:grid-cols-4 gap-4 px-6 py-4 items-start md:items-center hover:bg-muted/50 transition-colors"
                  >
                    {/* Form Name */}
                    <div className="col-span-1 w-full">
                      <p className="md:hidden text-xs font-semibold text-muted-foreground mb-1">
                        Form Name
                      </p>
                      <p className="font-medium text-foreground wrap-break-words">
                        {form.title}
                      </p>
                    </div>

                    {/* Created Date */}
                    <div className="col-span-1 w-full">
                      <p className="md:hidden text-xs font-semibold text-muted-foreground mb-1">
                        Created
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(form.createdAt || form.created)}
                      </p>
                    </div>

                    {/* Last Updated */}
                    <div className="col-span-1 w-full">
                      <p className="md:hidden text-xs font-semibold text-muted-foreground mb-1">
                        Last Updated
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(form.updatedAt || form.lastUpdated)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 w-full flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 md:flex-none gap-2"
                        size="sm"
                        asChild
                      >
                        <Link href={`/forms/${form.id}`}>
                          Open
                          <ChevronRight className="w-4 h-4 hidden md:block" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteForm(form.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashBoard;
