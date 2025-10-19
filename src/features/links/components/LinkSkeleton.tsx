import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonProps {
  width: number;
  height?: number;
  borderRadius?: number;
}

const SkeletonButton = ({ width, borderRadius, height }: SkeletonProps) => {
  return (
    <Skeleton
      className="mt-4 rounded-full"
      style={{
        width: `${width}px`,
        borderRadius: `${borderRadius}px`,
        height: `${height}px`,
      }}
    />
  );
};

const SkeletonP: React.FC<SkeletonProps> = ({ width }: SkeletonProps) => {
  return (
    <Skeleton
      className="mt-4 h-[10px] rounded-full"
      style={{ width: `${width}%` }}
    />
  );
};

const LinkSkeleton = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 mx-2">
      <div className="flex items-center gap-3 grow">
        <SkeletonButton height={30} width={30} borderRadius={4} />
        <SkeletonP width={50} />
      </div>
      <div className="flex items-center gap-3">
        <SkeletonButton height={30} width={30} borderRadius={4} />
        <SkeletonButton height={34} width={84} borderRadius={4} />
      </div>
    </div>
  );
};

export default LinkSkeleton;
