import { Skeleton } from "@/components/ui/skeleton";

export function UniversalSkeleton() {
  return (
    <div className="flex h-screen bg-background">

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </header>

        {/* Task list */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* Add task button */}
        <div className="mt-6">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}