import { useState } from "react";
import { Expense } from ".././types";

type Props = {
  onSubmit: (data: Omit<Expense, "id">) => void;
};

export const ExpenseForm = ({ onSubmit }: Props) => {
  // 今日の日付を取得
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today); // 今日の日付をデフォルト値に設定
  const [type, setType] = useState<0 | 1>(1);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !amount || !category) return;

    // 金額が正の整数かチェック
    const amountValue = parseInt(amount, 10);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("金額は正の整数を入力してください");
      return;
    }

    onSubmit({ date, type, amount: amountValue, category });

    // 入力後フォームをクリア
    setDate(today);
    setAmount("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <label>日付：</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <label>収支区分：</label>
        <select value={type} onChange={e => setType(Number(e.target.value) as 0 | 1)}>
          <option value={0}>収入</option>
          <option value={1}>支出</option>
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <label>金額：</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="1"
          step="1"
          required
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <label>用途区分：</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} required />
      </div>

      <button type="submit" style={{ marginTop: "10px" }}>追加</button>
    </form>
  );
};
