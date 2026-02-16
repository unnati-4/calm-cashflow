"use client";

import { useState, useEffect } from "react";

type Entry = {
  id: number;
  type: "Income" | "Expense";
  mode: "Cash" | "Online";
  category: string;
  amount: number;
  date: string;
};

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [mode, setMode] = useState<"Cash" | "Online">("Cash");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cashflow-data");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cashflow-data", JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!amount || !date) return;

    const newEntry: Entry = {
      id: Date.now(),
      type,
      mode,
      category,
      amount: parseFloat(amount),
      date,
    };

    setEntries([...entries, newEntry]);
    setAmount("");
    setDate("");
  };

  const totalIncome = entries
    .filter((e) => e.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = entries
    .filter((e) => e.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#f4efe6] flex justify-center items-start p-6">
      <div className="w-full max-w-4xl bg-[#fdfaf6] rounded-3xl shadow-xl p-8 space-y-8 border border-[#e8dccb]">
      
        <h1 className="text-3xl font-semibold text-center text-[#5c4033] tracking-wide">
          🍂 Calm Cashflow
        </h1>

        {/* Input Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="p-3 rounded-xl bg-[#f4efe6] border border-[#d6c3b3] text-[#5c4033]"
          >
            <option>Expense</option>
            <option>Income</option>
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="p-3 rounded-xl bg-[#f4efe6] border border-[#d6c3b3] text-[#5c4033]"
          >
            <option>Cash</option>
            <option>Online</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-xl bg-[#f4efe6] border border-[#d6c3b3] text-[#5c4033]"
          >
            <option>Food</option>
            <option>Shopping</option>
            <option>Gifts</option>
            <option>Other</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 rounded-xl bg-[#f4efe6] border border-[#d6c3b3] text-[#5c4033]"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 rounded-xl bg-[#f4efe6] border border-[#d6c3b3] text-[#5c4033] md:col-span-2"
          />
        </div>

        <button
          onClick={addEntry}
          className="w-full bg-[#6f4e37] text-white py-3 rounded-2xl hover:bg-[#5c4033] transition-all duration-300 shadow-md"
        >
          Add Entry
        </button>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-[#e6d5c3] p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <p className="text-sm text-[#5c4033]">Total Income</p>
            <p className="text-xl font-semibold text-[#4b2e2e]">
              ₹ {totalIncome}
            </p>
          </div>

          <div className="bg-[#eddad0] p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-[#5c4033]">Total Expense</p>
            <p className="text-xl font-semibold text-[#4b2e2e]">
              ₹ {totalExpense}
            </p>
          </div>

          <div className="bg-[#d7c3b1] p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-[#5c4033]">Balance</p>
            <p className="text-xl font-semibold text-[#4b2e2e]">
              ₹ {balance}
            </p>
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center bg-[#f4efe6] p-4 rounded-xl border border-[#e0d2c3] transition-all duration-500 ease-in-out opacity-0 animate-fadeIn"
            >

              <span className="text-sm text-[#5c4033]">
                {entry.date} | {entry.category} | {entry.mode}
              </span>
              <span
                className={
                  entry.type === "Income"
                    ? "text-green-700 font-medium"
                    : "text-red-700 font-medium"
                }
              >
                {entry.type === "Income" ? "+" : "-"} ₹ {entry.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}
