import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonProps } from "@/types";

const SkeletonP: React.FC<SkeletonProps> = ({ width }: SkeletonProps) => {
  return (
    <Skeleton
      className="mt-4 h-[10px] rounded-full"
      style={{ width: `${width}%` }}
    />
  );
};

export default SkeletonP;
