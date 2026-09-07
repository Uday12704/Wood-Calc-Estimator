import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Save,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  getWoodCategories,
  saveWoodCategories,
} from "../services/settings-storage";

import type {
  CalculationMode,
  WoodCategory,
} from "../types";

interface CategoryForm {
  name: string;
  calculationMode: CalculationMode;
}

const EMPTY_FORM: CategoryForm = {
  name: "",
  calculationMode: "CFT",
};

export function WoodCategoryCard() {
  const [categories, setCategories] = useState<
    WoodCategory[]
  >([]);

  const [form, setForm] =
    useState<CategoryForm>(EMPTY_FORM);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  useEffect(() => {
    setCategories(getWoodCategories());
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function updateForm(
    field: keyof CategoryForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleAdd() {
    const name = form.name.trim();

    if (!name) {
      toast.error("Category name is required.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.trim().toLowerCase() ===
        name.toLowerCase(),
    );

    if (duplicate) {
      toast.error(
        "A category with this name already exists.",
      );
      return;
    }

    const newCategory: WoodCategory = {
      id: crypto.randomUUID(),
      name,
      calculationMode: form.calculationMode,
    };

    const updatedCategories = [
      ...categories,
      newCategory,
    ];

    setCategories(updatedCategories);
    saveWoodCategories(updatedCategories);

    toast.success("Wood category added successfully.");

    resetForm();
  }

  function handleEdit(category: WoodCategory) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      calculationMode: category.calculationMode,
    });
  }

  function handleUpdate() {
    if (!editingId) {
      return;
    }

    const name = form.name.trim();

    if (!name) {
      toast.error("Category name is required.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.id !== editingId &&
        category.name.trim().toLowerCase() ===
          name.toLowerCase(),
    );

    if (duplicate) {
      toast.error(
        "A category with this name already exists.",
      );
      return;
    }

    const updatedCategories = categories.map(
      (category) =>
        category.id === editingId
          ? {
              ...category,
              name,
              calculationMode:
                form.calculationMode,
            }
          : category,
    );

    setCategories(updatedCategories);
    saveWoodCategories(updatedCategories);

    toast.success(
      "Wood category updated successfully.",
    );

    resetForm();
  }

  function handleDelete(category: WoodCategory) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    const updatedCategories = categories.filter(
      (item) => item.id !== category.id,
    );

    setCategories(updatedCategories);
    saveWoodCategories(updatedCategories);

    if (editingId === category.id) {
      resetForm();
    }

    toast.success("Wood category deleted.");
  }

  const isEditing = editingId !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-wood-primary">
          <Tags className="size-5" />
          Wood Categories
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Add and modify wood categories and their
          calculation methods.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* CATEGORY FORM */}

        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                {isEditing
                  ? "Edit Wood Category"
                  : "Add Wood Category"}
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Configure the category and its calculation
                method.
              </p>
            </div>

            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                <X className="mr-1.5 size-4" />
                Cancel
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
            {/* NAME */}

            <div className="space-y-2">
              <label
                htmlFor="wood-category-name"
                className="text-sm font-medium"
              >
                Category Name
              </label>

              <Input
                id="wood-category-name"
                value={form.name}
                onChange={(event) =>
                  updateForm(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Example: Teak"
              />
            </div>

            {/* CALCULATION MODE */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Calculation Method
              </label>

              <div className="flex h-10 items-center gap-5 rounded-md border bg-background px-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="calculation-mode"
                    value="CFT"
                    checked={
                      form.calculationMode ===
                      "CFT"
                    }
                    onChange={() =>
                      updateForm(
                        "calculationMode",
                        "CFT",
                      )
                    }
                  />

                  CFT
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="calculation-mode"
                    value="SQFT"
                    checked={
                      form.calculationMode ===
                      "SQFT"
                    }
                    onChange={() =>
                      updateForm(
                        "calculationMode",
                        "SQFT",
                      )
                    }
                  />

                  SqFt
                </label>
              </div>
            </div>

            {/* ACTION */}

            <Button
              type="button"
              onClick={
                isEditing
                  ? handleUpdate
                  : handleAdd
              }
              className="cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 size-4" />
                  Update
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Add Category
                </>
              )}
            </Button>
          </div>
        </div>

        {/* CATEGORY LIST */}

        {categories.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Tags className="mx-auto mb-3 size-8 text-muted-foreground" />

            <h3 className="text-sm font-semibold">
              No wood categories
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Add your first wood category above.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            {/* TABLE HEADER */}

            <div className="hidden grid-cols-[1fr_180px_100px] border-b bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
              <span>Category</span>
              <span>Calculation Method</span>
              <span className="text-right">
                Actions
              </span>
            </div>

            {/* ROWS */}

            {categories.map((category) => (
              <div
                key={category.id}
                className="grid gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_180px_100px] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {category.name}
                  </p>
                </div>

                <div>
                  <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {category.calculationMode ===
                    "CFT"
                      ? "CFT"
                      : "SqFt"}
                  </span>
                </div>

                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleEdit(category)
                    }
                    title="Edit category"
                  >
                    <Pencil className="size-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDelete(category)
                    }
                    title="Delete category"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}