import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "on-dark";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-green-700 text-white hover:bg-green-800 shadow-[0_10px_30px_rgba(27,77,50,0.22)]",
  secondary:
    "bg-white/90 text-green-900 border border-[color:var(--line)] hover:bg-white",
  ghost: "bg-transparent text-green-900 hover:bg-white/50",
  "on-dark":
    "bg-white text-green-900 hover:bg-[color:var(--cream-field)] shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
};

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type LinkButtonProps = CommonProps & {
  href: string;
};

type ActionButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold tracking-wide transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700";

export function ButtonLink({
  href,
  children,
  className = "",
  variant = "primary",
}: LinkButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ActionButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
