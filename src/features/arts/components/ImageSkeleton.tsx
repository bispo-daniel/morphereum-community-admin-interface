import { Skeleton } from "@/components/ui/skeleton";

const ImageSkeleton = ({ height }: { height: number }) => {
  return (
    <Skeleton
      style={{
        height: `${height}px`,
        minWidth: "330px",
        width: "100%",
        maxWidth: "600px",
      }}
      className="rounded-2xl"
    />
  );
};

export default ImageSkeleton;
