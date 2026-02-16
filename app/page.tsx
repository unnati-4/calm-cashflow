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

  const deleteEntry = (id: number) => {
    const updated = entries.filter((entry) => entry.id !== id);
    setEntries(updated);
  };

  const downloadCSV = () => {
    if (entries.length === 0) return;

    const headers = ["Type", "Mode", "Category", "Amount", "Date"];

    const rows = entries.map((e) => [
      e.type,
      e.mode,
      e.category,
      e.amount,
      e.date,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "calm-cashflow-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalIncome = entries
    .filter((e) => e.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = entries
    .filter((e) => e.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#f4efe6] flex justify-center items-start px-4 py-6 sm:p-8">
      <div className="w-full max-w-4xl bg-[#fdfaf6] rounded-3xl shadow-xl p-6 sm:p-8 space-y-8 border border-[#e8dccb]">

        {/* Logo Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-[#6f4e37] rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-semibold">MC</span>
          </div>
          <h1 className="text-3xl font-semibold text-[#5c4033] tracking-wide">
            Calm Cashflow
          </h1>
          <p className="text-sm text-[#8b735c]">
            Track your money peacefully
          </p>
        </div>

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
            <option>Salary</option>
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
          className="w-full bg-[#6f4e37] text-white py-3 rounded-2xl transition-all duration-300 hover:bg-[#5c4033] shadow-md"
        >
          Add Entry
        </button>

        <button
          onClick={downloadCSV}
          className="w-full bg-[#a1866f] text-white py-3 rounded-2xl transition-all duration-300 hover:bg-[#8b735c] shadow-sm"
        >
          Download CSV
        </button>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div className="bg-[#e6d5c3] p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <p className="text-sm text-[#5c4033]">Total Income</p>
            <p className="text-xl font-semibold text-[#4b2e2e]">
              ₹ {totalIncome}
            </p>
          </div>

          <div className="bg-[#eddad0] p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <p className="text-sm text-[#5c4033]">Total Expense</p>
            <p className="text-xl font-semibold text-[#4b2e2e]">
              ₹ {totalExpense}
            </p>
          </div>

          <div className="bg-[#d7c3b1] p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
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
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#f4efe6] p-4 rounded-xl border border-[#e0d2c3] transition-all duration-500 ease-in-out animate-fadeIn gap-2"
            >
              <span className="text-xs sm:text-sm text-[#5c4033]">
                {entry.date} | {entry.category} | {entry.mode}
              </span>

              <div className="flex justify-between sm:justify-end items-center gap-4">
                <span
                  className={
                    entry.type === "Income"
                      ? "text-green-700 font-medium"
                      : "text-red-700 font-medium"
                  }
                >
                  {entry.type === "Income" ? "+" : "-"} ₹ {entry.amount}
                </span>

                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-[#8b5e3c] hover:text-[#5c4033] transition-all duration-300 text-sm"
                >
                    🗑
                  </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
