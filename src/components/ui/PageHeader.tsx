type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="animate-rise text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="animate-rise animate-delay-1 font-display mt-3 text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
        {title}
      </h1>
      <p className="animate-rise animate-delay-2 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
        {description}
      </p>
    </div>
  );
}
