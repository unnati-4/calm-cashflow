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
    <div className="min-h-screen bg-zinc-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center text-zinc-700">
          🌿 Calm Cashflow Tracker
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="p-2 rounded-lg border"
          >
            <option>Expense</option>
            <option>Income</option>
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="p-2 rounded-lg border"
          >
            <option>Cash</option>
            <option>Online</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-lg border"
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
            className="p-2 rounded-lg border"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded-lg border md:col-span-2"
          />
        </div>

        <button
          onClick={addEntry}
          className="w-full bg-zinc-700 text-white py-2 rounded-xl hover:bg-zinc-800"
        >
          Add Entry
        </button>

        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-green-100 p-4 rounded-xl">
            <p className="text-sm text-zinc-600">Total Income</p>
            <p className="text-lg font-semibold">₹ {totalIncome}</p>
          </div>

          <div className="bg-red-100 p-4 rounded-xl">
            <p className="text-sm text-zinc-600">Total Expense</p>
            <p className="text-lg font-semibold">₹ {totalExpense}</p>
          </div>

          <div className="bg-blue-100 p-4 rounded-xl">
            <p className="text-sm text-zinc-600">Balance</p>
            <p className="text-lg font-semibold">₹ {balance}</p>
          </div>
        </div>

        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between bg-zinc-50 p-3 rounded-lg text-sm"
            >
              <span>
                {entry.date} | {entry.category} | {entry.mode}
              </span>
              <span
                className={
                  entry.type === "Income"
                    ? "text-green-600"
                    : "text-red-600"
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
