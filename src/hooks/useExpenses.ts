import { useState, useEffect } from "react";
import { Expense } from ".././types";

const STORAGE_KEY = "expenses";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    // 🔹 初回レンダリング時にローカルストレージからデータを読み込む
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  });

  // 🔹 データが変更されるたびにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  // 収支データを追加
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { id: Date.now(), ...expense };
    setExpenses(prevExpenses => [...prevExpenses, newExpense].sort((a, b) => (a.date > b.date ? 1 : -1)));
  };

  return { expenses, addExpense };
};
