import React, { useMemo, useState } from "react";

/**
 * WORLD CALC HUB – single-file React + Tailwind app (no external libs)
 * ---------------------------------------------------------------
 * - 18+ everyday calculators & converters
 * - Fast client-only math, no APIs
 * - Mobile-first, clean UI
 * - Search + category filter
 * - Easy to extend: add to CALC_REGISTRY at bottom
 *
 * How to use in your project:
 * 1) Drop this file into your React app (e.g., src/WorldCalcHub.jsx) and default export is a component.
 * 2) Ensure Tailwind is enabled. If not, replace classNames with your own CSS.
 * 3) Render <WorldCalcHub /> anywhere.
 */

const Card = ({ title, children }) => (
  <div className="rounded-2xl shadow-lg p-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border border-black/5">
    <h3 className="text-lg font-semibold mb-4 tracking-tight">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-2 mb-3">
    <span className="text-sm text-zinc-600 dark:text-zinc-300">{label}</span>
    {children}
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className={
      "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 " +
      "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
    }
  />
);

const Select = (props) => (
  <select
    {...props}
    className={
      "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 " +
      "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
    }
  />
);

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.98]"
  >
    {children}
  </button>
);

const Stat = ({ label, value }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-zinc-500 text-sm">{label}</span>
    <span className="font-semibold text-lg tabular-nums">{value}</span>
  </div>
);

// ------------------------------ UTILITIES ------------------------------
const toNum = (v, def = 0) => {
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : def;
};
const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
const fmt = (n, d = 2) => {
  if (n === undefined || n === null || Number.isNaN(n)) return "-";
  const s = Number(n);
  return Number.isFinite(s) ? s.toLocaleString(undefined, { maximumFractionDigits: d }) : "-";
};

// ------------------------------ CALCULATORS ------------------------------

function BasicCalculator() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState("+");
  const result = useMemo(() => {
    const x = toNum(a), y = toNum(b);
    switch (op) {
      case "+": return x + y;
      case "-": return x - y;
      case "×": return x * y;
      case "÷": return y === 0 ? NaN : x / y;
      default: return NaN;
    }
  }, [a, b, op]);
  return (
    <Card title="Basic Calculator">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <Field label="Number A"><Input type="number" value={a} onChange={e=>setA(e.target.value)} /></Field>
        <Field label="Operation">
          <Select value={op} onChange={(e)=>setOp(e.target.value)}>
            {['+','-','×','÷'].map(s=> <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Number B"><Input type="number" value={b} onChange={e=>setB(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Result" value={fmt(result, 6)} /></div>
    </Card>
  );
}

function PercentageCalculator() {
  const [base, setBase] = useState(100);
  const [pct, setPct] = useState(10);
  const inc = useMemo(()=> toNum(base) * (toNum(pct)/100), [base, pct]);
  const total = useMemo(()=> toNum(base) + inc, [base, inc]);
  return (
    <Card title="Percentage / Increase">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Base Amount"><Input type="number" value={base} onChange={e=>setBase(e.target.value)} /></Field>
        <Field label="Percent (%)"><Input type="number" value={pct} onChange={e=>setPct(e.target.value)} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        <Stat label="Increase" value={fmt(inc)} />
        <Stat label="Total" value={fmt(total)} />
      </div>
    </Card>
  );
}

function DiscountCalculator() {
  const [mrp, setMrp] = useState(1000);
  const [off, setOff] = useState(15);
  const disc = useMemo(()=> toNum(mrp) * (toNum(off)/100), [mrp, off]);
  const pay = useMemo(()=> toNum(mrp) - disc, [mrp, disc]);
  return (
    <Card title="Discount / Sale Price">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="MRP / Original Price"><Input type="number" value={mrp} onChange={e=>setMrp(e.target.value)} /></Field>
        <Field label="Discount (%)"><Input type="number" value={off} onChange={e=>setOff(e.target.value)} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        <Stat label="You Save" value={fmt(disc)} />
        <Stat label="Final Price" value={fmt(pay)} />
      </div>
    </Card>
  );
}

function GSTCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState("Add GST");
  const calc = useMemo(()=>{
    const a = toNum(amount), r = toNum(rate)/100;
    if (mode === "Add GST") {
      const tax = a * r; return { tax, total: a + tax };
    } else {
      // remove GST from inclusive amount
      const base = a / (1 + r); const tax = a - base; return { tax, total: base };
    }
  }, [amount, rate, mode]);
  return (
    <Card title="GST / VAT">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Amount"><Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} /></Field>
        <Field label="Rate (%)"><Input type="number" value={rate} onChange={e=>setRate(e.target.value)} /></Field>
        <Field label="Mode">
          <Select value={mode} onChange={(e)=>setMode(e.target.value)}>
            <option>Add GST</option>
            <option>Remove GST</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        <Stat label={mode === 'Add GST' ? 'Tax' : 'GST Part'} value={fmt(calc.tax)} />
        <Stat label={mode === 'Add GST' ? 'Total (Incl.)' : 'Base (Excl.)'} value={fmt(calc.total)} />
      </div>
    </Card>
  );
}

function BMICalculator() {
  const [unit, setUnit] = useState("Metric (kg, cm)");
  const [w, setW] = useState(70);
  const [h, setH] = useState(170);
  const bmi = useMemo(()=>{
    if (unit.startsWith("Metric")) {
      const m = toNum(h)/100; return toNum(w)/(m*m);
    } else {
      // Imperial: lbs, inches
      return (toNum(w) / (toNum(h) * toNum(h))) * 703;
    }
  }, [unit, w, h]);
  const status = useMemo(()=>{
    if (!Number.isFinite(bmi)) return "-";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }, [bmi]);
  return (
    <Card title="BMI (Body Mass Index)">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Units">
          <Select value={unit} onChange={e=>setUnit(e.target.value)}>
            <option>Metric (kg, cm)</option>
            <option>Imperial (lb, inch)</option>
          </Select>
        </Field>
        <Field label={unit.startsWith('Metric') ? 'Weight (kg)' : 'Weight (lb)'}>
          <Input type="number" value={w} onChange={e=>setW(e.target.value)} />
        </Field>
        <Field label={unit.startsWith('Metric') ? 'Height (cm)' : 'Height (inch)'}>
          <Input type="number" value={h} onChange={e=>setH(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        <Stat label="BMI" value={fmt(bmi, 2)} />
        <Stat label="Status" value={status} />
      </div>
    </Card>
  );
}

function AgeCalculator() {
  const [dob, setDob] = useState("1995-01-01");
  const diff = useMemo(()=>{
    const d = new Date(dob);
    if (isNaN(d)) return null;
    const now = new Date();
    let years = now.getFullYear() - d.getFullYear();
    let months = now.getMonth() - d.getMonth();
    let days = now.getDate() - d.getDate();
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonth; months -= 1;
    }
    if (months < 0) { months += 12; years -= 1; }
    return { years, months, days };
  }, [dob]);
  return (
    <Card title="Age Calculator">
      <Field label="Date of Birth"><Input type="date" value={dob} onChange={e=>setDob(e.target.value)} /></Field>
      <div className="mt-4 flex flex-wrap gap-6">
        <Stat label="Years" value={diff ? diff.years : '-'} />
        <Stat label="Months" value={diff ? diff.months : '-'} />
        <Stat label="Days" value={diff ? diff.days : '-'} />
      </div>
    </Card>
  );
}

function DateDiffCalculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const out = useMemo(()=>{
    const d1 = new Date(a), d2 = new Date(b);
    if (isNaN(d1) || isNaN(d2)) return null;
    const ms = Math.abs(d2 - d1);
    const days = Math.floor(ms / (1000*60*60*24));
    const weeks = days / 7;
    return { days, weeks };
  }, [a, b]);
  return (
    <Card title="Date Difference">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Date A"><Input type="date" value={a} onChange={e=>setA(e.target.value)} /></Field>
        <Field label="Date B"><Input type="date" value={b} onChange={e=>setB(e.target.value)} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        <Stat label="Days" value={out ? out.days : '-'} />
        <Stat label="Weeks" value={out ? fmt(out.weeks, 2) : '-'} />
      </div>
    </Card>
  );
}

function TemperatureConverter() {
  const [from, setFrom] = useState("Celsius");
  const [to, setTo] = useState("Fahrenheit");
  const [val, setVal] = useState(25);
  const convert = (v, f, t) => {
    v = toNum(v);
    // convert to C first
    let c = v;
    if (f === "Fahrenheit") c = (v - 32) * 5/9;
    if (f === "Kelvin") c = v - 273.15;
    // from C to target
    if (t === "Celsius") return c;
    if (t === "Fahrenheit") return (c * 9/5) + 32;
    if (t === "Kelvin") return c + 273.15;
    return NaN;
  };
  const out = useMemo(()=> convert(val, from, to), [val, from, to]);
  return (
    <Card title="Temperature Converter">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="From"><Select value={from} onChange={e=>setFrom(e.target.value)}>{["Celsius","Fahrenheit","Kelvin"].map(x=> <option key={x}>{x}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={e=>setTo(e.target.value)}>{["Celsius","Fahrenheit","Kelvin"].map(x=> <option key={x}>{x}</option>)}</Select></Field>
        <Field label="Value"><Input type="number" value={val} onChange={e=>setVal(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Output" value={fmt(out, 3)} /></div>
    </Card>
  );
}

function LengthConverter() {
  const units = [
    { id: "mm", toM: v=>v/1000, fromM: v=>v*1000 },
    { id: "cm", toM: v=>v/100, fromM: v=>v*100 },
    { id: "m", toM: v=>v, fromM: v=>v },
    { id: "km", toM: v=>v*1000, fromM: v=>v/1000 },
    { id: "inch", toM: v=>v*0.0254, fromM: v=>v/0.0254 },
    { id: "ft", toM: v=>v*0.3048, fromM: v=>v/0.3048 },
  ];
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [val, setVal] = useState(1);
  const out = useMemo(()=>{
    const v = toNum(val);
    const f = units.find(u=>u.id===from); const t = units.find(u=>u.id===to);
    if (!f || !t) return NaN;
    return t.fromM(f.toM(v));
  }, [val, from, to]);
  return (
    <Card title="Length Converter">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="From"><Select value={from} onChange={e=>setFrom(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={e=>setTo(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="Value"><Input type="number" value={val} onChange={e=>setVal(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Output" value={fmt(out, 6)} /></div>
    </Card>
  );
}

function WeightConverter() {
  const units = [
    { id: "g", toKg: v=>v/1000, fromKg: v=>v*1000 },
    { id: "kg", toKg: v=>v, fromKg: v=>v },
    { id: "lb", toKg: v=>v*0.45359237, fromKg: v=>v/0.45359237 },
  ];
  const [from, setFrom] = useState("kg");
  const [to, setTo] = useState("lb");
  const [val, setVal] = useState(1);
  const out = useMemo(()=>{
    const v = toNum(val);
    const f = units.find(u=>u.id===from); const t = units.find(u=>u.id===to);
    if (!f || !t) return NaN;
    return t.fromKg(f.toKg(v));
  }, [val, from, to]);
  return (
    <Card title="Weight Converter">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="From"><Select value={from} onChange={e=>setFrom(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={e=>setTo(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="Value"><Input type="number" value={val} onChange={e=>setVal(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Output" value={fmt(out, 6)} /></div>
    </Card>
  );
}

function TimeConverter() {
  const units = [
    { id: "sec", toS: v=>v, fromS: v=>v },
    { id: "min", toS: v=>v*60, fromS: v=>v/60 },
    { id: "hr", toS: v=>v*3600, fromS: v=>v/3600 },
    { id: "day", toS: v=>v*86400, fromS: v=>v/86400 },
  ];
  const [from, setFrom] = useState("min");
  const [to, setTo] = useState("sec");
  const [val, setVal] = useState(5);
  const out = useMemo(()=>{
    const v = toNum(val);
    const f = units.find(u=>u.id===from); const t = units.find(u=>u.id===to);
    if (!f || !t) return NaN; return t.fromS(f.toS(v));
  }, [val, from, to]);
  return (
    <Card title="Time Converter">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="From"><Select value={from} onChange={e=>setFrom(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={e=>setTo(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="Value"><Input type="number" value={val} onChange={e=>setVal(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Output" value={fmt(out, 6)} /></div>
    </Card>
  );
}

function SpeedConverter() {
  const units = [
    { id: "m/s", toMS: v=>v, fromMS: v=>v },
    { id: "km/h", toMS: v=>v/3.6, fromMS: v=>v*3.6 },
    { id: "mph", toMS: v=>v*0.44704, fromMS: v=>v/0.44704 },
  ];
  const [from, setFrom] = useState("km/h");
  const [to, setTo] = useState("m/s");
  const [val, setVal] = useState(60);
  const out = useMemo(()=>{
    const v = toNum(val);
    const f = units.find(u=>u.id===from); const t = units.find(u=>u.id===to);
    if (!f || !t) return NaN; return t.fromMS(f.toMS(v));
  }, [val, from, to]);
  return (
    <Card title="Speed Converter">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="From"><Select value={from} onChange={e=>setFrom(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={e=>setTo(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="Value"><Input type="number" value={val} onChange={e=>setVal(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Output" value={fmt(out, 6)} /></div>
    </Card>
  );
}

function AreaConverter() {
  const units = [
    { id: "sq m", toM2: v=>v, fromM2: v=>v },
    { id: "sq ft", toM2: v=>v*0.09290304, fromM2: v=>v/0.09290304 },
  ];
  const [from, setFrom] = useState("sq m");
  const [to, setTo] = useState("sq ft");
  const [val, setVal] = useState(1);
  const out = useMemo(()=>{
    const v = toNum(val);
    const f = units.find(u=>u.id===from); const t = units.find(u=>u.id===to);
    if (!f || !t) return NaN; return t.fromM2(f.toM2(v));
  }, [val, from, to]);
  return (
    <Card title="Area Converter">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="From"><Select value={from} onChange={e=>setFrom(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={e=>setTo(e.target.value)}>{units.map(u=> <option key={u.id}>{u.id}</option>)}</Select></Field>
        <Field label="Value"><Input type="number" value={val} onChange={e=>setVal(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Output" value={fmt(out, 6)} /></div>
    </Card>
  );
}

function EMI() {
  const [p, setP] = useState(500000);
  const [r, setR] = useState(10);
  const [tenureType, setTenureType] = useState("Years");
  const [t, setT] = useState(5);
  const out = useMemo(()=>{
    const principal = toNum(p);
    const monthlyR = toNum(r)/12/100;
    const months = tenureType === 'Years' ? Math.round(toNum(t)*12) : Math.round(toNum(t));
    if (monthlyR === 0) {
      const emi = principal / months; return { emi, total: principal, interest: 0, months };
    }
    const pow = Math.pow(1+monthlyR, months);
    const emi = principal * monthlyR * (pow / (pow - 1));
    const total = emi * months; const interest = total - principal;
    return { emi, total, interest, months };
  }, [p, r, t, tenureType]);
  return (
    <Card title="Loan EMI Calculator">
      <div className="grid sm:grid-cols-4 gap-3">
        <Field label="Principal (₹)"><Input type="number" value={p} onChange={e=>setP(e.target.value)} /></Field>
        <Field label="Interest (% p.a.)"><Input type="number" value={r} onChange={e=>setR(e.target.value)} /></Field>
        <Field label="Tenure Type">
          <Select value={tenureType} onChange={e=>setTenureType(e.target.value)}>
            <option>Years</option>
            <option>Months</option>
          </Select>
        </Field>
        <Field label={tenureType === 'Years' ? 'Tenure (Years)' : 'Tenure (Months)'}>
          <Input type="number" value={t} onChange={e=>setT(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 grid sm:grid-cols-4 gap-4">
        <Stat label="EMI / Month" value={`₹ ${fmt(out.emi, 2)}`} />
        <Stat label="Total Interest" value={`₹ ${fmt(out.interest, 2)}`} />
        <Stat label="Total Payment" value={`₹ ${fmt(out.total, 2)}`} />
        <Stat label="Months" value={out.months} />
      </div>
    </Card>
  );
}

function SIP() {
  const [m, setM] = useState(5000);
  const [r, setR] = useState(12);
  const [y, setY] = useState(10);
  const out = useMemo(()=>{
    const i = toNum(r)/12/100; const n = Math.round(toNum(y)*12); const a = toNum(m);
    // future value of SIP: A * [((1+i)^n - 1)/i] * (1+i)
    const pow = Math.pow(1+i, n);
    const fv = a * ((pow - 1) / i) * (1 + i);
    const invested = a * n; const gains = fv - invested;
    return { fv, invested, gains };
  }, [m, r, y]);
  return (
    <Card title="SIP Calculator (Monthly)">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Monthly Invest (₹)"><Input type="number" value={m} onChange={e=>setM(e.target.value)} /></Field>
        <Field label="Return (% p.a.)"><Input type="number" value={r} onChange={e=>setR(e.target.value)} /></Field>
        <Field label="Years"><Input type="number" value={y} onChange={e=>setY(e.target.value)} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        <Stat label="Future Value" value={`₹ ${fmt(out.fv, 2)}`} />
        <Stat label="Invested" value={`₹ ${fmt(out.invested, 2)}`} />
        <Stat label="Gains" value={`₹ ${fmt(out.gains, 2)}`} />
      </div>
    </Card>
  );
}

function CompoundInterest() {
  const [p, setP] = useState(10000);
  const [r, setR] = useState(7.5);
  const [n, setN] = useState(4); // times per year
  const [t, setT] = useState(5); // years
  const out = useMemo(()=>{
    const P = toNum(p), R = toNum(r)/100, N = Math.max(1, Math.round(toNum(n))), T = toNum(t);
    const A = P * Math.pow(1 + R/N, N*T);
    const interest = A - P;
    return { A, interest };
  }, [p, r, n, t]);
  return (
    <Card title="Compound Interest">
      <div className="grid sm:grid-cols-4 gap-3">
        <Field label="Principal"><Input type="number" value={p} onChange={e=>setP(e.target.value)} /></Field>
        <Field label="Rate (% p.a.)"><Input type="number" value={r} onChange={e=>setR(e.target.value)} /></Field>
        <Field label="Compounds / Year"><Input type="number" value={n} onChange={e=>setN(e.target.value)} /></Field>
        <Field label="Time (Years)"><Input type="number" value={t} onChange={e=>setT(e.target.value)} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-6">
        <Stat label="Amount" value={fmt(out.A, 2)} />
        <Stat label="Interest" value={fmt(out.interest, 2)} />
      </div>
    </Card>
  );
}

function FractionToDecimal() {
  const [num, setNum] = useState(1);
  const [den, setDen] = useState(2);
  const out = useMemo(()=>{
    const n = toNum(num), d = toNum(den);
    if (d === 0) return NaN; return n / d;
  }, [num, den]);
  return (
    <Card title="Fraction → Decimal">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Numerator"><Input type="number" value={num} onChange={e=>setNum(e.target.value)} /></Field>
        <Field label="Denominator"><Input type="number" value={den} onChange={e=>setDen(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Decimal" value={fmt(out, 10)} /></div>
    </Card>
  );
}

function BaseConverter() {
  const [from, setFrom] = useState(10);
  const [to, setTo] = useState(2);
  const [val, setVal] = useState("42");
  const out = useMemo(()=>{
    const n = parseInt(val, from);
    if (Number.isNaN(n)) return "-"; return n.toString(to).toUpperCase();
  }, [val, from, to]);
  return (
    <Card title="Number Base Converter">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="From Base"><Select value={from} onChange={e=>setFrom(parseInt(e.target.value))}>{[2,8,10,16,36].map(b=> <option key={b} value={b}>{b}</option>)}</Select></Field>
        <Field label="To Base"><Select value={to} onChange={e=>setTo(parseInt(e.target.value))}>{[2,8,10,16,36].map(b=> <option key={b} value={b}>{b}</option>)}</Select></Field>
        <Field label="Value"><Input value={val} onChange={e=>setVal(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Output" value={out} /></div>
    </Card>
  );
}

// ------------------------------ REGISTRY ------------------------------
const CALC_REGISTRY = [
  { id: "basic", title: "Basic Calculator", keywords: "add subtract multiply divide arithmetic", el: <BasicCalculator/> },
  { id: "percent", title: "Percentage", keywords: "percentage increase percent off", el: <PercentageCalculator/> },
  { id: "discount", title: "Discount", keywords: "sale price off", el: <DiscountCalculator/> },
  { id: "gst", title: "GST/VAT", keywords: "tax vat gst inclusive exclusive", el: <GSTCalculator/> },
  { id: "bmi", title: "BMI", keywords: "body mass index health", el: <BMICalculator/> },
  { id: "age", title: "Age", keywords: "age years months days", el: <AgeCalculator/> },
  { id: "datediff", title: "Date Difference", keywords: "days between dates weeks", el: <DateDiffCalculator/> },
  { id: "temp", title: "Temperature", keywords: "celsius fahrenheit kelvin", el: <TemperatureConverter/> },
  { id: "length", title: "Length", keywords: "mm cm m km inch foot", el: <LengthConverter/> },
  { id: "weight", title: "Weight", keywords: "g kg lb mass", el: <WeightConverter/> },
  { id: "time", title: "Time", keywords: "seconds minutes hours days", el: <TimeConverter/> },
  { id: "speed", title: "Speed", keywords: "km/h m/s mph", el: <SpeedConverter/> },
  { id: "area", title: "Area", keywords: "square meter foot", el: <AreaConverter/> },
  { id: "emi", title: "EMI", keywords: "loan monthly payment interest", el: <EMI/> },
  { id: "sip", title: "SIP", keywords: "mutual fund investment future value", el: <SIP/> },
  { id: "compound", title: "Compound Interest", keywords: "interest compounding", el: <CompoundInterest/> },
  { id: "fraction", title: "Fraction → Decimal", keywords: "rational number division", el: <FractionToDecimal/> },
  { id: "base", title: "Base Converter", keywords: "binary hex decimal", el: <BaseConverter/> },
];

// ------------------------------ SHELL ------------------------------
export default function WorldCalcHub() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(CALC_REGISTRY[0].id);
  const filtered = useMemo(()=> {
    const q = query.trim().toLowerCase();
    if (!q) return CALC_REGISTRY;
    return CALC_REGISTRY.filter(c =>
      c.title.toLowerCase().includes(q) || c.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  const current = filtered.find(c=>c.id===active) || filtered[0] || CALC_REGISTRY[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">🌍 World Calc Hub</h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-1">Ek hi jagah par saare popular calculators & converters — fast, simple, accurate.</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search: EMI, BMI, GST, Temperature, Length…"
            className="flex-1 rounded-2xl border px-4 py-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={()=>setActive(c.id)}
                className={
                  "px-3 py-2 rounded-xl border text-sm whitespace-nowrap " +
                  (c.id===current.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800")
                }
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <main className="grid grid-cols-1 gap-5">
          {current?.el}
        </main>

        <footer className="mt-10 text-xs text-zinc-500">
          <p>Tip: Naya calculator add karna ho to file ke end me <code>CALC_REGISTRY</code> me entry badhao aur ek naya React component banao. All local math, no tracking.</p>
        </footer>
      </div>
    </div>
  );
}
