import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useExpenses } from "./hooks/useExpenses";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseChart } from "./components/ExpenseChart";
import ExpenseList from "./components/ExpenseList";
import ExpenseEditForm from "./components/ExpenseEditForm";
import ExpenseListPage from "./pages/ExpenseListPage";

const App = () => {
  const { expenses, addExpense, getLatestExpenses } = useExpenses();

  return (
    <Router>
      <div>
        <h1>簡易出納帳</h1>
        <nav>
          <Link to="/">ホーム</Link> | <Link to="/list">一覧ページ</Link>
        </nav>

        <Routes>
          {/* 🟢 トップページ（最新5件 + 入力フォーム + グラフ） */}
          <Route path="/" element={
            <div>
              <ExpenseForm onSubmit={addExpense} />
              <ExpenseChart expenses={expenses} />
              <h2>最新5件の収支データ</h2>
              <ExpenseList expenses={getLatestExpenses()} />
            </div>
          } />

          {/* 🟢 一覧ページ（すべてのデータ + 編集機能） */}
          <Route path="/list" element={<ExpenseListPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
