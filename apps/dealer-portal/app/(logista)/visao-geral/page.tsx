/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
} from "lucide-react";

import dashboardServices, {
  type DashboardSnapshotResponse,
  type DashboardTimeframe,
} from "@/application/services/DashboardServices/DashboardServices";
import { Badge } from "@/presentation/ui/badge";
import { Button } from "@/presentation/ui/button";

import { Skeleton } from "@/presentation/ui/skeleton";

const timeframeFilters = [
  { label: "Últimos 7 dias", value: "7d" },
  { label: "Últimos 30 dias", value: "30d" },
  { label: "Último trimestre", value: "quarter" },
] as const;

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message
  ) {
    return (
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message ?? "Falha ao consultar o backend."
    );
  }

  if (typeof error === "object" && error && "message" in error) {
    const message = (error as { message?: string }).message;
    if (message) return message;
  }

  return "Não foi possível carregar o dashboard.";
};


const LoadingHighlightSkeleton = () => (
  <div className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-md">
    <Skeleton className="h-3 w-20 bg-white/40" />
    <Skeleton className="mt-3 h-6 w-24 bg-white/60" />
    <Skeleton className="mt-2 h-4 w-28 bg-white/40" />
  </div>
);

export default function Page() {
  const [activeTimeframe, setActiveTimeframe] =
    useState<DashboardTimeframe>("30d");
  const [snapshot, setSnapshot] = useState<DashboardSnapshotResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSnapshot = async () => {
      setLoading(true);
      setError(null);
      setSnapshot(null);

      try {
        const data = await dashboardServices.getSnapshot(activeTimeframe);
        if (isMounted) {
          setSnapshot(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSnapshot();

    return () => {
      isMounted = false;
    };
  }, [activeTimeframe]);


  const executiveHighlights = snapshot?.executiveHighlights ?? [];

  const meta = snapshot?.meta ?? {};
  const lastUpdateLabel = meta.lastUpdateLabel ?? "Atualizado às 10h45";
  const timeframeLabel = meta.timeframeLabel ?? "Ciclo fiscal 2024";
  const portfolioLabel =
    meta.activePortfolioLabel ?? "Carteira ativa • 312 propostas";
  const slaLabel = meta.slaLabel ?? "SLA médio 3h48 • Squad Daycoval";
  const goalLabel = meta.goalLabel ?? "Meta trimestral";
  const goalValue = meta.goalValue ?? "R$ 12,5 mi";
  const goalDeltaLabel =
    meta.goalDeltaLabel ?? "+6,2% sobre cenário base";
  const portfolioMonitorLabel =
    meta.portfolioMonitorLabel ?? "Carteira em acompanhamento";
  const portfolioValue = meta.portfolioValue ?? "R$ 21,8 mi";
  const portfolioDetail =
    meta.portfolioDetail ?? "42 contratos • inadimplência em 0,92%";
  const portfolioInsight =
    meta.portfolioInsight ?? "Top mix: SUVs (37%) • Picapes (33%).";
  const complianceInsight =
    meta.complianceInsight ?? "0 ocorrências críticas nos últimos 45 dias.";

  const isInitialLoading = loading && !snapshot;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#134B73] via-[#134B73] to-[#134B73] px-6 py-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute inset-0 opacity-40 blur-3xl">
          <div className="mx-auto h-full w-full max-w-2xl bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_65%)]" />
        </div>
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
              <Badge className="bg-white/15 text-white uppercase tracking-[0.35em]">
                Painel executivo
              </Badge>
              <span className="tracking-[0.2em]">
                {lastUpdateLabel} • {timeframeLabel}
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-tight lg:text-4xl">
              Governança e performance dos lojistas Grota em tempo real.
            </h1>
            <p className="max-w-2xl text-base text-white/80">
              Consolide aprovações, carteira ativa e conformidade em um único
              cockpit. Indicadores reconciliados a cada 30 minutos com o core
              Daycoval e prontos para o comitê executivo.
            </p>
            <div className="flex flex-wrap gap-2">
              {timeframeFilters.map((filter) => {
                const isActive = filter.value === activeTimeframe;
                return (
                  <Button
                    key={filter.value}
                    size="sm"
                    variant="ghost"
                    disabled={loading && isActive}
                    onClick={() => setActiveTimeframe(filter.value)}
                    className={`rounded-full border border-white/20 px-4 text-xs uppercase tracking-wide backdrop-blur ${isActive
                      ? "bg-white text-slate-900 font-semibold shadow-lg hover:bg-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </div>
            {error ? (
              <p className="text-xs font-semibold text-rose-100">{error}</p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {executiveHighlights.length
                ? executiveHighlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    className="rounded-2xl border border-white/20 bg-white/5 p-4 text-white/90 backdrop-blur-md"
                  >
                    <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
                      {highlight.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {highlight.value}
                    </p>
                    <p className="text-sm text-white/70">{highlight.helper}</p>
                  </div>
                ))
                : isInitialLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                    <LoadingHighlightSkeleton key={index} />
                  ))
                  : (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/70 backdrop-blur-md">
                      Sem destaques executivos para o período selecionado.
                    </div>
                  )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/15 text-white shadow-sm">
                {portfolioLabel}
              </Badge>
              <Badge className="bg-white/10 text-white">{slaLabel}</Badge>
            </div>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-lg">
            <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-xs uppercase text-white/70">{goalLabel}</p>
              <p className="mt-2 text-3xl font-semibold">{goalValue}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-200">
                <ArrowUpRight className="size-4" /> {goalDeltaLabel}
              </span>
              <p className="mt-4 text-xs text-white/70">
                Cobertura contratada em 42 concessionárias premium.
              </p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-[#0C2B44]/70 p-5 backdrop-blur-lg">
              <p className="text-xs uppercase text-white/70">
                {portfolioMonitorLabel}
              </p>
              <p className="mt-2 text-3xl font-semibold">{portfolioValue}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-white/80">
                {portfolioDetail}
              </span>
              <div className="mt-4 space-y-1 text-xs text-white/70">
                <p>{portfolioInsight}</p>
                <p>{complianceInsight}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
