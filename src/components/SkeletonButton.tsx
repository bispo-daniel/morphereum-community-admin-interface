import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonProps } from "@/types";

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

export default SkeletonButton;
