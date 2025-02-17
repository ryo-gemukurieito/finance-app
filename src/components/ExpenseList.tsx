import React from "react";
import { Expense } from "../types";

type Props = {
  expenses: Expense[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const ExpenseList: React.FC<Props> = ({ expenses, onEdit, onDelete }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>収支</th>
            <th>金額</th>
            <th>用途</th>
            {onEdit || onDelete ? <th>操作</th> : null}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.date}</td>
              <td>{expense.type === 0 ? "収入" : "支出"}</td>
              <td>{expense.amount.toLocaleString()}円</td>
              <td>{expense.category}</td>
              {(onEdit || onDelete) && (
                <td>
                  {onEdit && <button onClick={() => onEdit(expense.id)}>編集</button>}
                  {onDelete && <button onClick={() => onDelete(expense.id)}>削除</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
