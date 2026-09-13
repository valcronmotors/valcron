import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0b1a2b] px-3 text-sm text-slate-100 outline-none ring-cyan-400/40 focus:ring-2";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-200">
      {label}
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function MoneyInput({
  currency,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { currency: "USD" | "DOP" }) {
  const prefix = currency === "USD" ? "$" : "DOP$";

  return (
    <div className="relative mt-2">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
        {prefix}
      </span>
      <input
        {...props}
        type="number"
        min={props.min ?? 0}
        step={props.step ?? "0.01"}
        className={`${fieldClass} mt-0 pl-14 ${props.className ?? ""}`}
      />
    </div>
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${fieldClass} ${props.className ?? ""}`} />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-[#0b1a2b] px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 focus:ring-2 ${props.className ?? ""}`}
    />
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      {message}
    </p>
  );
}

export function SuccessBanner({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  if (!show) {
    return null;
  }

  return (
    <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
      {children}
    </p>
  );
}
