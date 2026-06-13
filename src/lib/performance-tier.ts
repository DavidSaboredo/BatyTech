export const performanceTierOptions = [
  { value: "ENTRY", label: "Entrada" },
  { value: "MID", label: "Media" },
  { value: "HIGH", label: "Alta" },
] as const;

export function getPerformanceTierLabel(value?: string | null) {
  return performanceTierOptions.find((option) => option.value === value)?.label ?? null;
}
