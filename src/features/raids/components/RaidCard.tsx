import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { parse, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

import { useDeleteRaid } from "../api/deleteRaid";
import { Raid } from "../api/getRaids";
import { useUpdateRaid } from "../api/updateRaid";

const RaidCard = ({
  _id,
  date,
  platform,
  url,
  shareMessage,
  content,
}: Raid) => {
  const { toast } = useToast();
  const {
    mutate: updateRaidMutate,
    isSuccess: isSuccessUpdatingRaid,
    isError: isErrorUpdatingRaid,
  } = useUpdateRaid();
  const {
    mutate: deleteRaidMutate,
    isSuccess: isSuccessDeletingRaid,
    isError: isErrorDeletingRaid,
  } = useDeleteRaid();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccessUpdatingRaid) {
      queryClient.invalidateQueries({ queryKey: ["raids"] });

      toast({
        title: "Raid atualizado com sucesso!",
        description: "O raid foi atualizado com sucesso.",
      });
    }

    if (isErrorUpdatingRaid) {
      toast({
        title: "Erro ao atualizar Raid.",
        description: "Tente novamente mais tarde.",
      });
    }
  }, [isSuccessUpdatingRaid, isErrorUpdatingRaid]);

  useEffect(() => {
    if (isSuccessDeletingRaid) {
      queryClient.invalidateQueries({ queryKey: ["raids"] });

      toast({
        title: "Raid removido com sucesso!",
        description: "O raid foi removido com sucesso.",
      });
    }

    if (isErrorDeletingRaid) {
      toast({
        title: "Erro ao remover Raid.",
        description: "Tente novamente mais tarde.",
      });
    }
  }, [isSuccessDeletingRaid, isErrorDeletingRaid]);

  const parsed = parseISO(date);
  const formattedDate = formatInTimeZone(parsed, "UTC", "dd/MM/yyyy");

  const todayUTC = formatInTimeZone(new Date(), "UTC", "yyyy-MM-dd");
  const raidUTC = formatInTimeZone(parsed, "UTC", "yyyy-MM-dd");

  const isToday = raidUTC === todayUTC;
  const isPast = raidUTC < todayUTC;

  const [editedRaid, setEditedRaid] = useState({
    _id,
    platform,
    date: formattedDate,
    url,
    shareMessage,
    content,
  });

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditedRaid((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  const updateRaid = () => {
    if (
      !editedRaid._id ||
      !editedRaid.platform ||
      !editedRaid.date ||
      !editedRaid.url ||
      !editedRaid.shareMessage ||
      !editedRaid.content
    ) {
      toast({
        title: "Preencha todos os campos.",
        description: "Todos os campos são obrigatórios.",
      });
      return;
    }

    const parsedDate = parse(editedRaid.date, "dd/MM/yyyy", new Date());
    parsedDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(parsedDate.getTime())) {
      toast({
        title: "Data inválida.",
        description: "Por favor, insira uma data válida no formato dd/MM/yyyy.",
      });
      return;
    }

    updateRaidMutate({
      ...editedRaid,
      date: parsedDate.toISOString(),
    });
  };

  return (
    <Sheet>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <SheetTrigger asChild>
            <Card className="h-32 select-none min-h-32 w-80 hover:cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between space-x-2">
                  <span className="truncate max-w-fit grow">{platform}</span>
                  <Badge
                    variant={isPast ? "destructive" : "outline"}
                    className={classNames({
                      "bg-[#306844] text-[hsl(var(--success-foreground))] transition-colors hover:bg-[#2c4c3b]":
                        isToday,
                    })}
                  >
                    {formattedDate}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="w-80 max-w-80">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="pr-10 truncate max-w-80">
                        {shareMessage}
                      </TooltipTrigger>
                      <TooltipContent
                        align="start"
                        className="select-none max-w-80"
                      >
                        {shareMessage}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardDescription>
              </CardContent>
            </Card>
          </SheetTrigger>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => deleteRaidMutate(_id)}>
            Remover Raid
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Sheet com formulário */}
      <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="select-none">Editar Raid</SheetTitle>
        </SheetHeader>
        <div className="min-h-full px-1 mt-4 space-y-4">
          <div className="space-y-1">
            <Label className="select-none">Plataforma</Label>
            <Input
              id="platform"
              onChange={onChange}
              value={editedRaid.platform}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Data</Label>
            <Input
              id="date"
              onChange={onChange}
              value={editedRaid.date}
              className="rounded-xl"
            />
            <Label className="ml-2 text-xs text-gray-300 select-none">
              formato: dd/mm/aaaa
            </Label>
          </div>
          <div className="space-y-1">
            <Label className="select-none">URL</Label>
            <Input
              id="url"
              onChange={onChange}
              value={editedRaid.url}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Mensagem</Label>
            <Input
              id="shareMessage"
              onChange={onChange}
              value={editedRaid.shareMessage}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="select-none">Conteúdo</Label>
            <Textarea
              id="content"
              className="w-full h-48 p-2 text-sm rounded-xl"
              value={editedRaid.content}
              onChange={onChange}
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
                {editedRaid.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <SheetFooter className="pt-4 pr-1 mt-auto select-none">
          <Button type="submit" className="rounded-xl" onClick={updateRaid}>
            Enviar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RaidCard;
