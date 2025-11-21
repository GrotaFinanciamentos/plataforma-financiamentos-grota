"use client";

import { Proposal } from "@/application/core/@types/Proposals/Proposal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog";
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[82vh] w-full max-w-6xl space-y-5 overflow-y-auto border border-[#1B4B7C]/20 bg-gradient-to-b from-[#0F2C55]/5 to-white px-0 sm:px-0">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="flex items-center justify-between gap-3 text-xl">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-[0.16em] text-[#1B4B7C]/70">
                Detalhes da proposta
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold text-[#0F2C55]">
                  #{proposal?.id ?? "—"}
                </span>
                {statusStyle ? (
                  <Badge
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-wide shadow-sm",
                      statusStyle.badge,
                    )}
                  >
                    {statusStyle.label}
                  </Badge>
                ) : null}
                <Badge variant="outline" className="text-[11px] font-medium">
                  Atualizado {formatDateTime(proposal?.updatedAt)}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm text-[#1B4B7C]/80">
            Visualize os detalhes, acompanhe o status e converse com nosso time em tempo real.
          </DialogDescription>
        </DialogHeader>

        {!proposal ? (
          <div className="px-6 pb-6 text-sm text-muted-foreground">
            Selecione uma ficha para visualizar os detalhes.
          </div>
        ) : (
          <div className="flex flex-col gap-5 overflow-y-auto pr-1 pb-6">
            <div className="mx-6 rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[#1B4B7C]/70">
                    Status atual
                  </p>
                  <p className="text-base font-semibold text-[#0F2C55]">
                    {statusStyle?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Última atualização em {formatDateTime(proposal.updatedAt)}
                  </p>
                </div>
                <div className="rounded-lg bg-[#1B4B7C]/5 px-4 py-2 text-right text-xs text-[#0F2C55]">
                  <p className="font-semibold">
                    Dealer #{proposal.dealerId ?? "—"}
                  </p>
                  <p className="text-xs text-[#1B4B7C]/80">
                    Operador #{proposal.sellerId ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-6 md:grid-cols-2">
              <div className="rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm space-y-2">
                <p className="text-sm font-semibold text-[#0F2C55]">Cliente</p>
                <p className="text-sm font-medium">{proposal.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  CPF {maskCpf(proposal.customerCpf)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Nascimento {formatDate(proposal.customerBirthDate)}
                </p>
              </div>

              <div className="rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm space-y-2">
                <p className="text-sm font-semibold text-[#0F2C55]">Contato</p>
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

            <div className="grid gap-4 px-6 md:grid-cols-2">
              <div className="rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm space-y-2">
                <p className="text-sm font-semibold text-[#0F2C55]">Veículo</p>
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

              <div className="rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm space-y-2">
                <p className="text-sm font-semibold text-[#0F2C55]">Valores</p>
                <p className="text-sm text-muted-foreground">
                  Entrada {formatCurrency(proposal.downPaymentValue)}
                </p>
                <p className="text-sm font-semibold text-emerald-600">
                  {formatCurrency(proposal.financedValue)} financiado
                </p>
              </div>
            </div>

            <div className="grid gap-4 px-6 md:grid-cols-2">
              <div className="rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm space-y-2">
                <p className="text-sm font-semibold text-[#0F2C55]">Banco / Produto</p>
                <p className="text-sm text-muted-foreground">Banco parceiro</p>
                <p className="text-sm text-muted-foreground">Produto personalizado</p>
                <p className="text-xs text-muted-foreground">
                  Referência FIPE {proposal.fipeCode}
                </p>
              </div>

              <div className="rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm space-y-2">
                <p className="text-sm font-semibold text-[#0F2C55]">Responsáveis</p>
                <p className="text-sm">
                  Dealer #{proposal.dealerId ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Operador #{proposal.sellerId ?? "—"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="mx-6 rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm space-y-2">
              <p className="text-sm font-semibold text-[#0F2C55]">Bancos consultados / observações</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {proposal.notes?.trim() || "Nenhum banco ou observação informado para esta proposta."}
              </p>
            </div>

            <div className="mx-6 rounded-xl border border-[#1B4B7C]/10 bg-white p-4 shadow-sm space-y-1 text-sm text-muted-foreground">
              <p>Criada em {formatDateTime(proposal.createdAt)}</p>
              <p>Atualizada em {formatDateTime(proposal.updatedAt)}</p>
            </div>

            <ProposalRealtimeChat
              proposalId={proposal.id}
              dealerId={proposal.dealerId}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
