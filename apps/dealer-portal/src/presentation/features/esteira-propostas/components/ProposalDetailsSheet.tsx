"use client";

import { Proposal } from "@/application/core/@types/Proposals/Proposal";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/presentation/ui/sheet";
import { Badge } from "@/presentation/ui/badge";
import { Separator } from "@/presentation/ui/separator";
import { proposalStatusStyles } from "./ProposalsTable";
import { cn } from "@/lib/utils";
import { ProposalRealtimeChat } from "./ProposalRealtimeChat";

type ProposalDetailsSheetProps = {
  open: boolean;
  proposal: Proposal | null;
  onClose: () => void;
};

const formatCurrency = (value?: number) =>
  typeof value === "number"
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(value)
    : "—";

const formatDateTime = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "—";

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(new Date(value))
    : "—";

const maskCpf = (cpf?: string) => {
  if (!cpf) return "—";
  const digits = cpf.replace(/\D/g, "").padStart(11, "0").slice(-11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const maskPhone = (phone?: string) => {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
};

export function ProposalDetailsSheet({
  open,
  proposal,
  onClose,
}: ProposalDetailsSheetProps) {
  const statusStyle = proposal
    ? proposalStatusStyles[proposal.status]
    : null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full space-y-4 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Detalhes da proposta
            {statusStyle ? (
              <Badge
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide",
                  statusStyle.badge,
                )}
              >
                {statusStyle.label}
              </Badge>
            ) : null}
          </SheetTitle>
          <SheetDescription>
            Proposta #{proposal?.id ?? "—"} · Atualizado em{" "}
            {formatDateTime(proposal?.updatedAt)}
          </SheetDescription>
        </SheetHeader>

        {!proposal ? (
          <div className="p-4 text-sm text-muted-foreground">
            Selecione uma ficha para visualizar os detalhes.
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 pb-6">
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase text-muted-foreground">Status atual</p>
              <p className="text-sm font-semibold">{statusStyle?.label}</p>
              <p className="text-xs text-muted-foreground">
                Última atualização em {formatDateTime(proposal.updatedAt)}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-semibold">Cliente</p>
                <p className="text-sm">{proposal.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  CPF {maskCpf(proposal.customerCpf)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Nascimento {formatDate(proposal.customerBirthDate)}
                </p>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-semibold">Contato</p>
                <p className="text-sm text-muted-foreground">
                  {proposal.customerEmail || "Sem e-mail informado"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {maskPhone(proposal.customerPhone)}
                </p>
                <p className="text-sm text-muted-foreground">
                  CNH {proposal.hasCnh ? "Sim" : "Não"} · Cat. {proposal.cnhCategory}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-semibold">Veículo</p>
                <p className="text-sm">
                  {proposal.vehicleBrand} · {proposal.vehicleModel} ({proposal.vehicleYear})
                </p>
                <p className="text-sm text-muted-foreground">
                  Placa {proposal.vehiclePlate || "—"}
                </p>
                <p className="text-sm text-muted-foreground">
                  FIPE {proposal.fipeCode} · {formatCurrency(proposal.fipeValue)}
                </p>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-semibold">Valores</p>
                <p className="text-sm text-muted-foreground">
                  Entrada {formatCurrency(proposal.downPaymentValue)}
                </p>
                <p className="text-sm font-semibold text-emerald-600">
                  {formatCurrency(proposal.financedValue)} financiado
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-semibold">Banco / Produto</p>
                <p className="text-sm text-muted-foreground">Banco parceiro</p>
                <p className="text-sm text-muted-foreground">Produto personalizado</p>
                <p className="text-xs text-muted-foreground">
                  Referência FIPE {proposal.fipeCode}
                </p>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-semibold">Responsáveis</p>
                <p className="text-sm">
                  Dealer #{proposal.dealerId ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Operador #{proposal.sellerId ?? "—"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-semibold">Bancos consultados / observações</p>
              <p className="text-sm text-muted-foreground">
                {proposal.notes?.trim() || "Nenhum banco ou observação informado para esta proposta."}
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-1 text-sm text-muted-foreground">
              <p>Criada em {formatDateTime(proposal.createdAt)}</p>
              <p>Atualizada em {formatDateTime(proposal.updatedAt)}</p>
            </div>

            <ProposalRealtimeChat
              proposalId={proposal.id}
              dealerId={proposal.dealerId}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
