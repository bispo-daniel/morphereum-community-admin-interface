import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

import { useDeleteLink } from "../api/deleteLink";
import { type Link as LinkProps } from "../api/getLinks";
import { useUpdateLink } from "../api/updateLink";
import IconMap from "./IconMap";

const Link = ({ icon, url, _id, label, type }: LinkProps) => {
  const { toast } = useToast();
  const {
    mutate: updateLinkMutate,
    isSuccess: isSuccessUpdatingLink,
    isError: isErrorUpdatingLink,
  } = useUpdateLink();
  const {
    mutate: deleteLinkMutate,
    isSuccess: isSuccessDeletingLink,
    isError: isErrorDeletingLink,
  } = useDeleteLink();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccessUpdatingLink) {
      queryClient.invalidateQueries({ queryKey: ["links"] });

      toast({
        title: "Link atualizado com sucesso!",
        description: "O link foi atualizado com sucesso.",
      });
    }

    if (isErrorUpdatingLink) {
      toast({
        title: "Erro ao atualizar Link.",
        description: "Tente novamente mais tarde.",
      });
    }
  }, [isSuccessUpdatingLink, isErrorUpdatingLink]);

  useEffect(() => {
    if (isSuccessDeletingLink) {
      queryClient.invalidateQueries({ queryKey: ["links"] });

      toast({
        title: "Link removido com sucesso!",
        description: "O link foi removido com sucesso.",
      });
    }

    if (isErrorDeletingLink) {
      toast({
        title: "Erro ao remover Link.",
        description: "Tente novamente mais tarde.",
      });
    }
  }, [isSuccessDeletingLink, isErrorDeletingLink]);

  const [editedLink, setEditedLink] = useState({
    _id,
    icon,
    url,
    label,
    type,
  });

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditedLink((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  const updateLink = () => {
    if (
      !editedLink._id ||
      !editedLink.icon ||
      !editedLink.url ||
      !editedLink.label ||
      !editedLink.type
    ) {
      toast({
        title: "Preencha todos os campos.",
        description: "Todos os campos são obrigatórios.",
      });
      return;
    }

    updateLinkMutate(editedLink);
  };

  const openLink = () => {
    window.open(url, "_blank");
  };

  return (
    <Sheet>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <SheetTrigger asChild>
            <div className="m-2 flex select-none items-center justify-between rounded px-4 py-2 transition-colors hover:bg-[hsl(var(--hover-shade))]">
              <button
                className="rounded border p-1.5 hover:bg-accent hover:text-accent-foreground"
                onClick={openLink}
              >
                <IconMap icon={icon} size={16} />
              </button>

              <p className="pl-2 overflow-hidden text-sm truncate shrink grow text-ellipsis whitespace-nowrap hover:cursor-pointer hover:underline">
                {label}
              </p>
            </div>
          </SheetTrigger>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => deleteLinkMutate(_id)}>
            Remover Link
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="select-none">Editar Link</SheetTitle>
        </SheetHeader>
        <div className="px-1 mt-4 space-y-4">
          <div className="space-y-1">
            <Label className="select-none">Ícone</Label>
            <Input
              id="icon"
              onChange={onChange}
              value={editedLink.icon}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">URL</Label>
            <Input
              id="url"
              onChange={onChange}
              value={editedLink.url}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Plataforma</Label>
            <Input
              id="label"
              onChange={onChange}
              value={editedLink.label}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Typo</Label>

            {/* adicionar a chamada ao onChange */}
            <Select
              value={editedLink.type}
              onValueChange={(value) =>
                setEditedLink((prev) => ({
                  ...prev,
                  type: value as "community-links" | "official-links",
                }))
              }
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectGroup>
                  <SelectLabel>Tipo</SelectLabel>
                  <SelectItem value="community-links">Comunidade</SelectItem>
                  <SelectItem value="official-links">Oficial</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="fixed pr-1 select-none bottom-4 right-4">
          <Button type="submit" className="rounded-xl" onClick={updateLink}>
            Enviar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Link;
