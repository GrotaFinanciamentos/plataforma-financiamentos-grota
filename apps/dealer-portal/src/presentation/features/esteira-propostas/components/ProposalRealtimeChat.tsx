"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Send, Signal, WifiOff } from "lucide-react";
import { REALTIME_CHANNELS, useRealtimeChannel } from "@grota/realtime-client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/presentation/ui/card";
import { Badge } from "@/presentation/ui/badge";
import { Input } from "@/presentation/ui/input";
import { Button } from "@/presentation/ui/button";

type ProposalRealtimeChatProps = {
  proposalId: number | null;
  dealerId?: number | null;
};

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_WS_URL;
const IDENTITY = "logista";
const CHANNEL = REALTIME_CHANNELS.CHAT;

const statusStyles = {
  connected: {
    label: "Online",
    className: "bg-emerald-100 text-emerald-700",
    Icon: Signal,
  },
  connecting: {
    label: "Conectando",
    className: "bg-amber-100 text-amber-800",
    Icon: Signal,
  },
  disconnected: {
    label: "Offline",
    className: "bg-slate-200 text-slate-800",
    Icon: WifiOff,
  },
  idle: {
    label: "Aguardando",
    className: "bg-muted text-muted-foreground",
    Icon: Signal,
  },
  error: {
    label: "Erro",
    className: "bg-rose-100 text-rose-700",
    Icon: WifiOff,
  },
} as const;

const formatMessageTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeProposalId = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }
  return null;
};

export function ProposalRealtimeChat({
  proposalId,
  dealerId,
}: ProposalRealtimeChatProps) {
  const [message, setMessage] = useState("");

  const { messages, participants, sendMessage, status } = useRealtimeChannel({
    channel: CHANNEL,
    identity: IDENTITY,
    url: REALTIME_URL,
    metadata: { origin: "dealer-panel" },
  });

  const filteredMessages = useMemo(() => {
    if (!proposalId) return [];
    return messages.filter((item) => {
      const metaProposalId = normalizeProposalId(item.meta?.proposalId);
      return metaProposalId === proposalId;
    });
  }, [messages, proposalId]);

  const orderedMessages = useMemo(() => {
    return [...filteredMessages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }, [filteredMessages]);

  const statusData =
    statusStyles[status as keyof typeof statusStyles] ?? statusStyles.idle;

  const isSendingDisabled =
    status !== "connected" || message.trim().length === 0 || !proposalId;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !proposalId) return;
    const ok = sendMessage(trimmed, {
      proposalId,
      dealerId,
      scope: "proposal-chat",
    });
    if (ok) {
      setMessage("");
    }
  };

  return (
    <Card className="border border-[#1B4B7C]/20 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[#0F2C55]">
          <MessageSquare className="h-4 w-4 text-primary" />
          Chat em tempo real (admin)
        </CardTitle>
        <Badge className={cn("gap-1 text-[11px] shadow-sm", statusData.className)}>
          <statusData.Icon className="h-3.5 w-3.5" />
          {statusData.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {!proposalId ? (
          <p className="text-sm text-muted-foreground">
            Selecione uma proposta para abrir o chat com a administração.
          </p>
        ) : (
          <div className="rounded-2xl border border-[#1B4B7C]/10 bg-gradient-to-br from-white to-[#0F2C55]/5 p-3">
            <div className="flex max-h-[260px] flex-col gap-3 overflow-y-auto pr-1">
              {orderedMessages.length === 0 ? (
                <div className="flex h-28 flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
                  <MessageSquare className="h-5 w-5 text-muted-foreground/70" />
                  Nenhuma mensagem nesta proposta.
                </div>
              ) : (
                orderedMessages.map((item) => {
                  const isSelf = item.sender === IDENTITY;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex w-full",
                        isSelf ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[82%] rounded-2xl px-4 py-2 text-sm shadow-sm transition-colors",
                          isSelf
                            ? "bg-[#0F2C55] text-white"
                            : "bg-white text-foreground border border-[#1B4B7C]/10",
                        )}
                      >
                        <p className="whitespace-pre-line leading-relaxed">
                          {item.body}
                        </p>
                        <span
                          className={cn(
                            "mt-1 block text-[11px]",
                            isSelf
                              ? "text-white/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {isSelf ? "Você" : item.sender} ·{" "}
                          {formatMessageTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-medium">
                {participants.length} conectado{participants.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-[#1B4B7C]/10 pt-3">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Envie uma atualização para a equipe Grota..."
            disabled={status !== "connected" || !proposalId}
          />
          <Button
            type="submit"
            disabled={isSendingDisabled}
            size="icon"
            aria-label="Enviar mensagem"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
