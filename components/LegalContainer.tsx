export default function LegalContainer({
  title,
  children,
  lastUpdated,
}: {
  title: string;
  children: React.ReactNode;
  lastUpdated: string;
}) {
  return (
    <div className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-6 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          {title}
        </h1>
        <p className="mb-10 text-center text-sm text-muted-foreground">
          Last Updated: {lastUpdated}
        </p>

        <div className="space-y-8 text-[15px] leading-7 text-foreground/90 [&_a]:text-orange-400 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-orange-300 [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}
