import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./ui.module.css";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "default" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: styles.primary,
  outline: styles.outline,
  ghost: styles.ghost,
};

const sizeClassMap: Record<ButtonSize, string> = {
  default: styles.defaultSize,
  lg: styles.largeSize,
  icon: styles.iconSize,
};

function cn(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function Button({
  asChild = false,
  children,
  className,
  size = "default",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = cn(
    styles.button,
    variantClassMap[variant],
    sizeClassMap[size],
    className,
  );

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
