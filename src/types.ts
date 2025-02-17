export type Expense = {
  id: number;
  date: string;       // YYYY/MM/DD の日付形式
  type: 0 | 1;        // 0 = 収入, 1 = 支出
  amount: number;     // 金額
  category: string;   // 用途区分
};
