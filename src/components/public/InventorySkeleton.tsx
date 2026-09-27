export function InventoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.15rem] border border-[#ececea] bg-white">
      <div className="aspect-[16/10] animate-pulse bg-[#ececea]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-[#ececea]" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#ececea]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#ececea]" />
      </div>
    </div>
  );
}

export function InventorySectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="section-light bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="h-4 w-28 animate-pulse rounded bg-[#ececea]" />
        <div className="mt-4 h-10 max-w-md animate-pulse rounded bg-[#ececea]" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: count }, (_, index) => (
            <InventoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-40 animate-pulse rounded-[1.15rem] border border-[#ececea] bg-white" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <InventoryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
