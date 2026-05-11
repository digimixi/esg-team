export default function Loading() {
  return (
    <div className="min-h-screen bg-surface overflow-hidden">
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

      {/* Hero Section Skeleton */}
      <div className="h-[60vh] bg-surface-container-low relative animate-shimmer">
        <div className="absolute bottom-24 left-margin right-margin max-w-container-max mx-auto">
          <div className="h-16 w-3/4 md:w-1/2 bg-surface-container-high rounded-xl mb-4" />
          <div className="h-6 w-1/2 md:w-1/3 bg-surface-container rounded-lg" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <section className="py-stack-lg px-margin max-w-container-max mx-auto">
        {/* Title Skeleton */}
        <div className="mb-stack-lg">
          <div className="h-10 w-48 bg-surface-container-high rounded-lg mb-2" />
          <div className="h-4 w-64 bg-surface-container rounded-md" />
        </div>

        {/* Catalog Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden h-[500px]">
              <div className="h-48 bg-surface-container animate-shimmer" />
              <div className="p-stack-md">
                <div className="h-6 w-24 bg-secondary-container/50 rounded-full mb-4" />
                <div className="h-8 w-3/4 bg-surface-container-high rounded-lg mb-4" />
                <div className="space-y-2 mb-8">
                  <div className="h-4 w-full bg-surface-container rounded" />
                  <div className="h-4 w-5/6 bg-surface-container rounded" />
                  <div className="h-4 w-4/6 bg-surface-container rounded" />
                </div>
                <div className="pt-stack-md border-t border-outline-variant flex justify-between">
                  <div className="h-4 w-24 bg-surface-container" />
                  <div className="h-4 w-20 bg-surface-container" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Intelligence Section Skeleton */}
        <div className="mt-stack-xl pt-stack-xl border-t border-outline-variant">
          <div className="h-8 w-48 bg-surface-container-high rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-md">
            {[1, 2, 4, 5].map((i) => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-md h-64">
                <div className="flex justify-between mb-4">
                   <div className="h-5 w-12 bg-surface-container rounded" />
                   <div className="h-5 w-24 bg-surface-container rounded" />
                </div>
                <div className="h-12 w-full bg-surface-container-high rounded-lg mb-4" />
                <div className="h-16 w-full bg-surface-container rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
