import { Skeleton } from "@/components/ui/Skeleton";

export function FeedSkeleton() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Live Section Skeleton */}
      <section className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video rounded-2xl w-full" />
              <div className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="space-y-6">
        <Skeleton className="h-4 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
               <div className="flex items-center gap-3">
                 <Skeleton className="w-10 h-10 rounded-full" />
                 <Skeleton className="h-4 w-32" />
               </div>
               <Skeleton className="aspect-[4/5] rounded-2xl w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
