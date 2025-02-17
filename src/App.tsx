import { useExpenses } from "./hooks/useExpenses";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseChart } from "./components/ExpenseChart";

const App = () => {
  const { expenses, addExpense } = useExpenses();

  return (
    <div>
      <h1>簡易出納帳</h1>
      <ExpenseForm onSubmit={addExpense} />

      <h2>収支一覧</h2>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.date} {e.type === 0 ? "収入" : "支出"} {e.amount.toLocaleString()}円 {e.category}
          </li>
        ))}
      </ul>

      <ExpenseChart expenses={expenses} />
    </div>
  );
};

export default App;
