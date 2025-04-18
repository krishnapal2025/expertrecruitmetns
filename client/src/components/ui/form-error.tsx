import { ReactNode } from "react";

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-medium text-destructive mt-1">{children}</p>
  );
}