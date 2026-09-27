export default function InventarioLoading() {
  return (
    <main className="section-light bg-[#faf9f6]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="h-10 w-64 animate-pulse rounded bg-[#ececea]" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-[1.15rem] border border-[#ececea] bg-white">
              <div className="aspect-[16/10] animate-pulse bg-[#ececea]" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-24 animate-pulse rounded bg-[#ececea]" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-[#ececea]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
