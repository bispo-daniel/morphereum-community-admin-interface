import { useQueryClient } from "@tanstack/react-query";
import { parse } from "date-fns";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { useRegisterRaid } from "../api/createRaid";

const CreateRaidSheet = () => {
  const [raid, setRaid] = useState({
    platform: "",
    date: "",
    url: "",
    shareMessage: "",
    content: "",
  });

  const { toast } = useToast();
  const { mutate: registerRaidMutate, isSuccess, isError } = useRegisterRaid();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["raids"] });

      toast({
        title: "Raid criado com sucesso!",
        description: "O raid foi criado com sucesso.",
      });
    }

    if (isError) {
      toast({
        title: "Erro ao criar Raid.",
        description: "Ocorreu um erro ao criar o raid.",
      });
    }
  }, [isSuccess, isError]);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRaid((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  const registerRaid = () => {
    if (
      !raid.platform ||
      !raid.date ||
      !raid.url ||
      !raid.shareMessage ||
      !raid.content
    ) {
      toast({
        title: "Preencha todos os campos.",
        description: "Todos os campos são obrigatórios.",
      });
      return;
    }

    const parsedDate = parse(raid.date, "dd/MM/yyyy", new Date());
    parsedDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(parsedDate.getTime())) {
      toast({
        title: "Data inválida.",
        description: "Por favor, insira uma data válida no formato dd/MM/yyyy.",
      });
      return;
    }

    registerRaidMutate({
      ...raid,
      date: parsedDate.toISOString(),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <p className="z-[30] my-4 inline-flex h-10 select-none items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-2xl font-medium transition-colors hover:cursor-pointer hover:bg-transparent hover:font-bold hover:underline focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:text-slate-50">
          [Criar um novo Raid]
        </p>
      </SheetTrigger>
      <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="select-none">Criar novo Raid</SheetTitle>
        </SheetHeader>

        <div className="min-h-full px-1 mt-4 space-y-4">
          <div className="space-y-1">
            <Label className="select-none">Plataforma</Label>
            <Input id="platform" onChange={onChange} className="rounded-xl" />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Data</Label>
            <Input id="date" onChange={onChange} className="rounded-xl" />
            <Label className="ml-2 text-xs text-gray-300 select-none">
              formato: dd/mm/aaaa
            </Label>
          </div>
          <div className="space-y-1">
            <Label className="select-none">URL</Label>
            <Input id="url" onChange={onChange} className="rounded-xl" />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Mensagem</Label>
            <Input
              id="shareMessage"
              onChange={onChange}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Conteúdo</Label>
            <Textarea
              id="content"
              onChange={onChange}
              className="w-full h-48 p-2 text-sm rounded-xl"
              placeholder="Type your markdown here..."
            />
            <Label className="ml-2 text-xs text-gray-300 select-none">
              tipo: markdown
            </Label>
          </div>

          <div className="space-y-1">
            <Label className="select-none">Pré visualização</Label>
            <div className="mt-3 max-h-[500px] select-none overflow-y-auto rounded-xl border border-[hsl(var(--border))] p-3">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {raid.content || "## Hello, World!"}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <SheetFooter className="pt-4 pr-1 mt-auto select-none">
          <SheetClose asChild>
            <Button type="submit" className="rounded-xl" onClick={registerRaid}>
              Enviar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateRaidSheet;
