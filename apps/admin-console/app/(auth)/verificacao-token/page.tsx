import { VerifyTokenPage } from "@/presentation/features/auth/components/verify-token-page"

type VerificationTokenParams = {
  tipo?: "verificacao" | "redefinicao-senha";
  email?: string;
};

interface VerificationTokenProps {
  searchParams?: Promise<VerificationTokenParams>;
}

export default async function VerificationToken({
  searchParams,
}: VerificationTokenProps) {
  const params = (await searchParams) ?? {};
  const tokenType =
    params.tipo === "redefinicao-senha" ? params.tipo : "verificacao";

  return (
    <VerifyTokenPage
      heroImageSrc="https://res.cloudinary.com/dx1659yxu/image/upload/v1760451243/linda-mulher-comprando-um-carro_lp9oo0.jpg"
      tokenType={tokenType}
      email={params.email ?? ""}
    />
  );
}
