import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList, ReferenceLine } from "recharts";
import { Expense } from "../types";
import { aggregateMonthlyData, aggregateCategoryData } from "../utils/format";

type Props = {
  expenses: Expense[];
};

export const ExpenseChart = ({ expenses }: Props) => {
  // 🔹 URLパラメータの取得・セット
  const [searchParams, setSearchParams] = useSearchParams();
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  // 🔹 期間フィルタの適用関数
  const filterByDate = <T extends { month: string }>(data: T[]) => {
    return data.filter(d => (!startDate || d.month >= startDate) && (!endDate || d.month <= endDate));
  };

  // 🔹 収入・支出データを取得し、ソート
  let incomeData = aggregateMonthlyData(expenses, 0).sort((a, b) => a.month.localeCompare(b.month));
  let expenseData = aggregateMonthlyData(expenses, 1).sort((a, b) => a.month.localeCompare(b.month));

  // 🔹 フィルター適用
  incomeData = filterByDate(incomeData);
  expenseData = filterByDate(expenseData);

  // 🔹 収支の合計値（収入 - 支出）
  let balanceData = incomeData.map(income => {
    const expense = expenseData.find(e => e.month === income.month);
    return {
      month: income.month,
      balance: income.amount - (expense ? expense.amount : 0),
    };
  }).sort((a, b) => a.month.localeCompare(b.month));

  balanceData = filterByDate(balanceData);

  // 🔹 フィルタ済みの支出データからカテゴリデータを集計
  const filteredCategoryData = aggregateCategoryData(expenses.filter(e => {
    const month = e.date.substring(0, 7); // YYYY-MM 形式
    return (!startDate || month >= startDate) && (!endDate || month <= endDate);
  }));

  // 🔹 総支出額を計算（円グラフの割合を出すため）
  const totalExpense = filteredCategoryData.reduce((sum, item) => sum + item.amount, 0);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#FFBB28"];

  // 🔹 フィルター変更時にURLパラメータを更新
  useEffect(() => {
    setSearchParams({ startDate, endDate });
  }, [startDate, endDate, setSearchParams]);

  return (
    <div>
      {/* 🔹 期間フィルタ用フォーム */}
      <div>
        <label>
          開始日:
          <input
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          終了日:
          <input
            type="month"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      {/* 1️⃣ 収支の合計値グラフ */}
      <h3>収支の合計（月ごとの収入 - 支出）</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={balanceData}>
          <XAxis dataKey="month" />
          <YAxis domain={['auto', 'auto']} tickFormatter={(value) => value.toLocaleString()} />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <ReferenceLine y={0} stroke="black" strokeWidth={2} />
          <Bar dataKey="balance">
            {balanceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? "#0088FE" : "#FF4D4D"} />
            ))}
            <LabelList
              dataKey="balance"
              position="middle"
              content={({ value, x, y, width }) => (
                <text
                  x={Number(x) + Number(width) / 2}
                  y={Number(y)}
                  fill="black"
                  fontSize="12px"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {value !== undefined ? `${value.toLocaleString()}円` : "-"}
                </text>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 2️⃣ 支出の月次グラフ */}
      <h3>支出の月次グラフ</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={expenseData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#ff8042">
            <LabelList dataKey="amount" position="middle" style={{ fill: "black" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 3️⃣ 収入の月次グラフ */}
      <h3>収入の月次グラフ</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={incomeData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#82ca9d">
            <LabelList dataKey="amount" position="middle" style={{ fill: "black" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 4️⃣ 支出のカテゴリ割合（円グラフ） */}
      <h3>支出のカテゴリ割合</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={filteredCategoryData}
            dataKey="amount"
            nameKey="category"
            outerRadius={100}
            label={({ name, value }) =>
              `${name}: ${value.toLocaleString()}円 (${((value / totalExpense) * 100).toFixed(1)}%)`
            }
          >
            {filteredCategoryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
