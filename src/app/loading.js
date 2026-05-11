export default function Loading() {
  return (
    <div className="min-h-screen bg-surface">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          position: relative;
          overflow: hidden;
        }
        .animate-shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          animation: shimmer 1.5s infinite;
        }
      `}} />

      {/* Header Skeleton */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant h-16">
        <div className="flex justify-between items-center px-margin h-full max-w-container-max mx-auto">
          <div className="h-8 w-32 bg-surface-container rounded" />
          <div className="hidden lg:flex gap-8">
            <div className="h-4 w-20 bg-surface-container" />
            <div className="h-4 w-20 bg-surface-container" />
            <div className="h-4 w-20 bg-surface-container" />
          </div>
          <div className="h-10 w-24 bg-surface-container-high rounded" />
        </div>
      </header>

      <main className="pt-16">
        {/* 1. Hero Skeleton */}
        <section className="h-[500px] bg-surface-container-low flex items-center border-b border-outline-variant animate-shimmer">
          <div className="max-w-container-max mx-auto px-margin w-full flex flex-col items-center">
            <div className="h-8 w-64 bg-surface-container rounded-full mb-6" />
            <div className="h-16 w-3/4 bg-surface-container-high rounded-xl mb-4" />
            <div className="h-6 w-1/2 bg-surface-container rounded-lg" />
          </div>
        </section>

        {/* 2. Hubs Grid Skeleton */}
        <section className="py-stack-xl px-margin max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-8 h-[400px] bg-surface-container-low rounded-2xl animate-shimmer" />
            <div className="md:col-span-4 h-[400px] bg-surface-container-low rounded-2xl animate-shimmer" />
          </div>
        </section>

        {/* 3. Global Intelligence Section Skeleton */}
        <section className="py-stack-lg px-margin max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div className="h-10 w-48 bg-surface-container-high rounded-lg" />
            <div className="h-6 w-32 bg-surface-container rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-md">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-md h-80 animate-pulse">
                <div className="h-12 w-full bg-surface-container-high rounded-lg mb-4" />
                <div className="h-24 w-full bg-surface-container rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Market Index Skeleton */}
        <section className="bg-surface-container py-stack-md border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin">
            <div className="flex flex-1 justify-around items-center overflow-x-auto no-scrollbar">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-gutter text-center min-w-[180px]">
                  <div className="h-3 w-16 bg-surface-container rounded mx-auto mb-2" />
                  <div className="h-6 w-24 bg-surface-container-high rounded mx-auto mb-2" />
                  <div className="h-4 w-12 bg-surface-container rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
