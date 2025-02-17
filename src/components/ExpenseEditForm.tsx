import React, { useState } from "react";
import { Expense } from "../types";

type Props = {
  expense: Expense;
  onSave: (updatedExpense: Expense) => void;
  onCancel: () => void;
};

const ExpenseEditForm: React.FC<Props> = ({ expense, onSave, onCancel }) => {
  const [editedExpense, setEditedExpense] = useState(expense);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditedExpense({
      ...editedExpense,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedExpense);
  };

  return (
    <div>
      <h3>データの編集</h3>
      <form onSubmit={handleSubmit}>
        <label>
          日付：
          <input type="date" name="date" value={editedExpense.date} onChange={handleChange} required />
        </label>
        <label>
          収支区分：
          <select name="type" value={editedExpense.type} onChange={handleChange}>
            <option value="0">収入</option>
            <option value="1">支出</option>
          </select>
        </label>
        <label>
          金額：
          <input type="number" name="amount" value={editedExpense.amount} onChange={handleChange} required />
        </label>
        <label>
          用途：
          <input type="text" name="category" value={editedExpense.category} onChange={handleChange} required />
        </label>
        <button type="submit">保存</button>
        <button type="button" onClick={onCancel}>キャンセル</button>
      </form>
    </div>
  );
};

export default ExpenseEditForm;
