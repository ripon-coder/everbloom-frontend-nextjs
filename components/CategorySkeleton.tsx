"use client";

const SkeletonItem = ({ level }: { level: number }) => (
  <div
    className="flex items-center justify-between py-1.5 px-2 rounded-md"
    style={{ paddingLeft: `${level * 20 + 8}px` }}
  >
    {/* Left section (folder + name) */}
    <div className="flex items-center gap-2 min-w-0 flex-1">
      {/* Folder icon */}
      <div className="flex-shrink-0">
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>

      {/* Category name */}
      <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
    </div>

    {/* Right side expand arrow */}
    <div className="ml-2 flex-shrink-0 p-1">
      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
    </div>
  </div>
);

export default function CategorySkeleton() {
  return (
    <div className="bg-white rounded-lg p-3 space-y-1 animate-pulse">
      <SkeletonItem level={0} />
      <SkeletonItem level={0} />
      <SkeletonItem level={1} />
      <SkeletonItem level={1} />
      <SkeletonItem level={2} />
      <SkeletonItem level={0} />
      <SkeletonItem level={1} />
    </div>
  );
}