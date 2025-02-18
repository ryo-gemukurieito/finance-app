import { useState, useEffect } from "react";
import { Expense } from "../types";

const STORAGE_KEY = "expenses";

// ローカルストレージから最新データを取得
const getStoredExpenses = (): Expense[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(getStoredExpenses);

  // 🔹 ローカルストレージが変更されたら自動的に更新する
  useEffect(() => {
    const syncWithLocalStorage = () => {
      setExpenses(getStoredExpenses());
    };

    window.addEventListener("storage", syncWithLocalStorage);
    return () => window.removeEventListener("storage", syncWithLocalStorage);
  }, []);

  const updateLocalStorage = (updatedExpenses: Expense[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));
    setExpenses([...updatedExpenses]); // 強制更新
    window.location.reload();
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const currentExpenses = getStoredExpenses();
    const newExpense = { id: Date.now(), ...expense };
    const updatedExpenses = [...currentExpenses, newExpense].sort((a, b) => (a.date > b.date ? -1 : 1));
    updateLocalStorage(updatedExpenses);
  };

  const updateExpense = (id: number, updatedExpense: Expense) => {
    const currentExpenses = getStoredExpenses();
    const updatedExpenses = currentExpenses.map((exp) => (exp.id === id ? updatedExpense : exp));
    updateLocalStorage(updatedExpenses);
    //window.location.reload();
  };

  const deleteExpense = (id: number) => {
    const currentExpenses = getStoredExpenses();
    const updatedExpenses = currentExpenses.filter((exp) => exp.id !== id);
    updateLocalStorage(updatedExpenses);
    //window.location.reload();
  };

  const getLatestExpenses = () => {
    return getStoredExpenses().sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 5);
  };

  return { expenses, addExpense, updateExpense, deleteExpense, getLatestExpenses };
};
