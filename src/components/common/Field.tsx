"use client";

export default function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;

    // Name: letters and spaces only
    if (name === "name") {
      input.value = input.value.replace(/[^A-Za-z\s]/g, "");
    }

    // Email: lowercase only
    if (name === "email") {
      input.value = input.value.toLowerCase();
    }

    // Phone: numbers only, maximum 10 digits
    if (name === "phone") {
      input.value = input.value.replace(/\D/g, "").slice(0, 10);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
        {label}
        {required && <span className="text-orange"> *</span>}
      </label>

      <input
        type={type}
        name={name}
        required={required}
        maxLength={name === "phone" ? 10 : undefined}
        inputMode={name === "phone" ? "numeric" : undefined}
        pattern={
          name === "name"
            ? "[A-Za-z\\s]+"
            : name === "phone"
              ? "[0-9]{10}"
              : undefined
        }
        onInput={handleInput}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-orange/60"
      />
    </div>
  );
}