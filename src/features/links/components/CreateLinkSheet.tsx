import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

import { useRegisterLink } from "../api/createLink";
import { type Link } from "../api/getLinks";

const CreateLinkSheet = () => {
  const [link, setLink] = useState<Omit<Link, "_id">>({
    icon: "",
    url: "",
    label: "",
    type: "community-links",
  });

  const { toast } = useToast();
  const { mutate: registerLinkMutate, isSuccess, isError } = useRegisterLink();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["links"] });

      toast({
        title: "Link criado com sucesso!",
        description: "O link foi criado com sucesso.",
      });
    }

    if (isError) {
      toast({
        title: "Erro ao criar Link.",
        description: "Ocorreu um erro ao criar o link.",
      });
    }
  }, [isSuccess, isError]);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLink((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  const registerLink = () => {
    if (!link.icon || !link.url || !link.label || !link.type) {
      toast({
        title: "Preencha todos os campos.",
        description: "Todos os campos são obrigatórios.",
      });
      return;
    }

    registerLinkMutate(link);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <p className="z-[30] mb-2 inline-flex h-10 select-none items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-2xl font-medium transition-colors hover:cursor-pointer hover:bg-transparent hover:font-bold hover:underline focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:text-slate-50">
          [Criar um novo Link]
        </p>
      </SheetTrigger>
      <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="select-none">Criar novo Link</SheetTitle>
        </SheetHeader>

        <div className="px-1 mt-4 space-y-4">
          <div className="space-y-1">
            <Label className="select-none">Ícone</Label>
            <Input
              id="icon"
              onChange={onChange}
              value={link.icon}
              className="rounded-xl"
            />
            <Label className="ml-2 text-xs text-gray-300 hover:underline">
              <a
                href="https://simpleicons.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                @icons-pack/react-simple-icons (ex: SiX)
              </a>
            </Label>
          </div>
          <div className="space-y-1">
            <Label className="select-none">URL</Label>
            <Input
              id="url"
              onChange={onChange}
              value={link.url}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Plataforma</Label>
            <Input
              id="label"
              onChange={onChange}
              value={link.label}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Typo</Label>

            {/* adicionar a chamada ao onChange */}
            <Select
              value={link.type}
              onValueChange={(value) =>
                setLink((prev) => ({
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
          <SheetClose asChild>
            <Button type="submit" className="rounded-xl" onClick={registerLink}>
              Enviar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateLinkSheet;
