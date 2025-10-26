import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import env from "@/config";
import { useToast } from "@/hooks/use-toast";

import { useDeleteArt } from "./api/deleteArt";
import { type Art as ArtType, useArts } from "./api/getArts";
import { useUpdateArt } from "./api/updateArt";
import { FullscreenCarrousel, Image, ImageSkeleton } from "./components";

const Arts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isFetching, isFetchingNextPage, isRefetching } = useArts();

  const {
    mutate: deleteArtMutate,
    isSuccess: isSuccessDeletingArt,
    isError: isErrorDeletingArt,
  } = useDeleteArt();

  const {
    mutate: approveArtMutate,
    isSuccess: isSuccessApprovingArt,
    isError: isErrorApprovingArt,
  } = useUpdateArt();

  const [colNumber, setColNumber] = useState(3);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [imageData, setImageData] = useState<Partial<ArtType> | null>(null);

  const arts = useMemo(() => {
    return data?.pages.flatMap((page) => [...page.arts]) || [];
  }, [data]);

  const lastArtId = arts[arts.length - 1]?._id;

  useEffect(() => {
    if (isSuccessApprovingArt) {
      queryClient.invalidateQueries({ queryKey: ["arts"] });

      toast({
        title: "Arte aprovada com sucesso!",
        description: "A arte foi aprovada com sucesso.",
      });

      setOpenImage(false);
    }

    if (isErrorApprovingArt) {
      toast({
        title: "Erro ao atualizar Arte.",
        description: "Tente novamente mais tarde.",
      });
    }
  }, [isSuccessApprovingArt, isErrorApprovingArt]);

  useEffect(() => {
    if (isSuccessDeletingArt) {
      queryClient.invalidateQueries({ queryKey: ["arts"] });

      toast({
        title: "Arte removida com sucesso!",
        description: "A arte foi deletada com sucesso.",
      });

      setOpenImage(false);
    }

    if (isErrorDeletingArt) {
      toast({
        title: "Erro ao remover Arte.",
        description: "Tente novamente mais tarde.",
      });
    }
  }, [isSuccessDeletingArt, isErrorDeletingArt]);

  const calculateColNumber = () => {
    const mobile = window.innerWidth < 768;
    const tablet = window.innerWidth < 1024;

    const getColNumber = (): number => {
      if (mobile) return 1;
      if (tablet) return 2;
      return 3;
    };

    setColNumber(getColNumber());
  };

  useEffect(() => {
    calculateColNumber();

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateColNumber, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleApprove(artId: string) {
    approveArtMutate(artId);
  }

  function handleRemove(artId: string) {
    deleteArtMutate(artId);
  }

  return (
    <>
      <div className="mt-[20px] flex flex-col items-center justify-center">
        {arts.length === 0 && !isFetching && (
          <p className="w-full text-sm text-center select-none">
            Nenhuma arte encontrada.
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 px-8 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(colNumber)].map((_, colIndex) => (
            <div key={colIndex} className="flex min-w-[250px] flex-col gap-8">
              {arts
                .filter((_, index) => index % colNumber === colIndex)
                .map((art) => (
                  <Image
                    key={art._id}
                    _id={art._id}
                    url={art.url}
                    creator={art.creator}
                    xProfile={art.xProfile}
                    description={art.description}
                    approved={art.approved}
                    openFullscreen={() => setOpenImage(true)}
                    setImageData={setImageData}
                    isLast={art._id === lastArtId}
                  />
                ))}

              {(isFetching || isFetchingNextPage || isRefetching) &&
                Array.from({ length: env.VITE_ART_RECORDS_PER_PAGE }).map((_, index) => (
                  <ImageSkeleton height={350} key={index} />
                ))}
            </div>
          ))}
        </div>
      </div>

      {openImage && imageData && (
        <FullscreenCarrousel
          _id={imageData._id || ""}
          src={imageData.url || ""}
          creator={imageData.creator || ""}
          xLink={imageData.xProfile || ""}
          description={imageData.description || ""}
          closeFullscreen={() => setOpenImage(false)}
          onApprove={handleApprove}
          onRemove={handleRemove}
        />
      )}
    </>
  );
};

export default Arts;
