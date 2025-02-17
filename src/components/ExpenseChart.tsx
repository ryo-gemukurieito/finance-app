import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList, ReferenceLine } from "recharts";
import { Expense } from "../types";
import { aggregateMonthlyData, aggregateCategoryData } from "../utils/format";

type Props = {
  expenses: Expense[];
};

export const ExpenseChart = ({ expenses }: Props) => {
  const incomeData = aggregateMonthlyData(expenses, 0); // 収入データ
  const expenseData = aggregateMonthlyData(expenses, 1); // 支出データ
  const categoryData = aggregateCategoryData(expenses); // 支出カテゴリデータ

  // 収支の合計値（収入 - 支出）
  const balanceData = incomeData.map(income => {
    const expense = expenseData.find(e => e.month === income.month);
    return {
      month: income.month,
      balance: income.amount - (expense ? expense.amount : 0),
    };
  });

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#FFBB28"];

  return (
    <div>
      {/* 1️⃣ 収支の合計値グラフ（0の位置に軸線を追加） */}
      <h3>収支の合計（月ごとの収入 - 支出）</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={balanceData}>
          <XAxis dataKey="month" />
          <YAxis domain={['auto', 'auto']} tickFormatter={(value) => value.toLocaleString()} />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <ReferenceLine y={0} stroke="black" strokeWidth={2} /> {/* 0の位置に線を引く */}
          <Bar dataKey="balance">
            {balanceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? "#0088FE" : "#FF4D4D"} />
            ))}
            <LabelList dataKey="balance" position="top" />
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
            <LabelList dataKey="amount" position="top" />
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
            <LabelList dataKey="amount" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 4️⃣ 支出のカテゴリ割合（円グラフ） */}
      <h3>支出のカテゴリ割合</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={categoryData} dataKey="amount" nameKey="category" outerRadius={100} label>
            {categoryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
