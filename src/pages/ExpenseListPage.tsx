import React, { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import ExpenseList from "../components/ExpenseList";
import ExpenseEditForm from "../components/ExpenseEditForm";
import { Expense } from "../types";

const ExpenseListPage: React.FC = () => {
  const { expenses, updateExpense, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEdit = (id: number) => {
    const expenseToEdit = expenses.find(exp => exp.id === id);
    if (expenseToEdit) {
      setEditingExpense(expenseToEdit);
    }
  };

  const handleSave = (updatedExpense: Expense) => {
    updateExpense(updatedExpense.id, updatedExpense);
    setEditingExpense(null);
  };

  return (
    <div>
      <h2>収支一覧</h2>
      {editingExpense ? (
        <ExpenseEditForm
          expense={editingExpense}
          onSave={handleSave}
          onCancel={() => setEditingExpense(null)}
        />
      ) : (
        <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={deleteExpense} />
      )}
    </div>
  );
};

export default ExpenseListPage;
