export function AdminDashboardSkeleton() {
  return (
    <div className="grid gap-6" aria-hidden="true">
      <div className="h-16 max-w-xl animate-pulse rounded-lg bg-[var(--admin-surface-muted)]" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="h-40 animate-pulse rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]" />
        <div className="h-40 animate-pulse rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]"
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="h-72 animate-pulse rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]" />
        <div className="h-72 animate-pulse rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]" />
      </div>
    </div>
  );
}

export function AdminListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-4" aria-hidden="true">
      <div className="flex justify-between gap-4">
        <div className="h-12 w-64 animate-pulse rounded-lg bg-[var(--admin-surface-muted)]" />
        <div className="h-11 w-40 animate-pulse rounded-lg bg-[var(--admin-surface-muted)]" />
      </div>
      <div className="h-16 animate-pulse rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]" />
      <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-[var(--admin-border)] px-4 py-4 last:border-0"
          >
            <div className="h-12 w-16 animate-pulse rounded-md bg-[var(--admin-surface-muted)]" />
            <div className="h-4 flex-1 animate-pulse rounded bg-[var(--admin-surface-muted)]" />
            <div className="hidden h-4 w-20 animate-pulse rounded bg-[var(--admin-surface-muted)] sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="grid gap-6" aria-hidden="true">
      <div className="h-20 animate-pulse rounded-xl bg-[var(--admin-surface-muted)]" />
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]"
        />
      ))}
    </div>
  );
}
