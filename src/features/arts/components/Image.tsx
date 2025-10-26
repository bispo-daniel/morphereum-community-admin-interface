import classNames from "classnames";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import tokenImg from "@/assets/token.png";
import { Button } from "@/components/ui/button";

import { Arts, useArts } from "../api/getArts";
import CustomButton from "./CustomButton";

const Image = ({
  _id,
  url,
  creator,
  xProfile,
  description,
  approved,
  openFullscreen,
  closeFullscreen,
  setImageData,
  isFullscreen,
  isLast,
  onApprove,
  onRemove,
}: {
  _id: string;
  url: string;
  creator: string;
  xProfile: string;
  description: string;
  approved?: boolean;
  openFullscreen?: () => void;
  closeFullscreen?: () => void;
  setImageData: (data: Partial<Arts["arts"][number]>) => void;
  isFullscreen?: boolean;
  isLast?: boolean;
  onApprove?: (_id: string) => void;
  onRemove?: (_id: string) => void;
}) => {
  const { ref, inView } = useInView({ threshold: 1 });
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useArts();

  const [imgSrc, setImgSrc] = useState(url);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLast && inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isLast]);

  const openLink = () => {
    window.open(xProfile, "_blank");
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectURL;
      link.download = "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  function handleApprove() {
    if (onApprove) {
      onApprove(_id);
    }
  }

  function handleRemove() {
    if (onRemove) {
      onRemove(_id);
    }
  }

  const openImage = () => {
    if (!openFullscreen) return;
    openFullscreen();
    setImageData({ _id, url, creator, xProfile, description });
  };

  return (
    <>
      <div
        className={classNames({
          "group relative flex max-h-[600px] max-w-[600px] cursor-pointer select-none items-center justify-center overflow-hidden rounded-2xl":
            true,
          "h-[500px] rounded-l-2xl bg-background md:rounded-r-none":
            isFullscreen,
          "min-h-[350px] min-w-[330px]": !isLoaded,
          "border-2 border-red-500": !approved && !isFullscreen,
          "border-2 border-green-500": approved && !isFullscreen,
        })}
        ref={isLast ? ref : null}
        onClick={openImage}
      >
        <img
          className={classNames({
            "select-none object-cover transition-all duration-1000": true,
            "group-hover:scale-110": !isFullscreen,
            "h-full w-full rounded-2xl group-hover:opacity-75 md:rounded-r-none":
              isFullscreen,
          })}
          style={{ color: "transparent" }}
          src={imgSrc}
          draggable={false}
          loading="lazy"
          onError={() => setImgSrc(tokenImg)}
          onLoad={() => setIsLoaded(true)}
        />

        {!isFullscreen && (
          <div className="absolute inset-0 flex flex-col-reverse justify-between p-4 transition-colors duration-500 sm:hidden sm:bg-[#0001] sm:group-hover:flex sm:dark:bg-[#0004]">
            <div className="flex flex-row items-center justify-between w-full">
              <p
                className="arts-text max-w-[125px] truncate text-[var(--coin-pink)] transition-all hover:underline dark:text-white dark:hover:text-[var(--coin-pink)]"
                onClick={openLink}
              >
                {creator}
              </p>

              <CustomButton action={downloadImage} />
            </div>
          </div>
        )}
      </div>

      {isFullscreen && closeFullscreen && (
        <div className="hidden h-[500px] max-h-[500px] flex-col gap-4 overflow-hidden rounded-r-2xl border-l bg-background p-4 md:flex">
          <div className="flex items-center justify-between w-full">
            <p
              className="arts-text max-w-[125px] select-none truncate text-[var(--coin-pink)] hover:cursor-pointer hover:underline"
              onClick={openLink}
            >
              {creator}
            </p>
            <Button
              onClick={closeFullscreen}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <X />
            </Button>
          </div>
          <p className="arts-description m-0 w-[180px] select-none overflow-y-auto text-pretty break-words pb-1 align-middle text-sm">
            {description}
          </p>

          <div className="flex flex-col w-full gap-2 mt-auto">
            <CustomButton
              action={downloadImage}
              type="pink"
              placeholder="download"
            />
            {!approved && (
              <CustomButton
                action={handleApprove}
                type="success"
                placeholder="aprovar"
              />
            )}
            <CustomButton
              action={handleRemove}
              type="error"
              placeholder="remover"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Image;
