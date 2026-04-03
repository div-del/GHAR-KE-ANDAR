import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ui.module.css";

type BadgeVariant = "secondary" | "success";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

function cn(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function Badge({
  children,
  className,
  variant = "secondary",
  ...props
}: BadgeProps) {
  const variantClass =
    variant === "success" ? styles.badgeSuccess : styles.badgeSecondary;

  return (
    <div className={cn(styles.badge, variantClass, className)} {...props}>
      {children}
    </div>
  );
}
