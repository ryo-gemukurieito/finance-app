import { Expense } from "../types";
import dayjs from "dayjs";

/**
 * 月ごとの合計金額を計算する
 */
export const aggregateMonthlyData = (expenses: Expense[], type: 0 | 1) => {
  const monthlyData: Record<string, number> = {};

  expenses
    .filter(e => e.type === type) // 収入(0) or 支出(1) をフィルタリング
    .forEach(e => {
      const month = dayjs(e.date).format("YYYY-MM");
      monthlyData[month] = (monthlyData[month] || 0) + e.amount;
    });

  return Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }));
};

/**
 * 支出のカテゴリ別の合計を計算
 */
export const aggregateCategoryData = (expenses: Expense[]) => {
  const categoryData: Record<string, number> = {};

  expenses
    .filter(e => e.type === 1) // 支出のみ対象
    .forEach(e => {
      categoryData[e.category] = (categoryData[e.category] || 0) + e.amount;
    });

  return Object.entries(categoryData).map(([category, amount]) => ({ category, amount }));
};
