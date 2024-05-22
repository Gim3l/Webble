import type { MetaFunction } from "@remix-run/node";
import { HeroSection } from "~/components/layout/Hero";
import { UseCasesSection } from "~/components/layout/UseCases";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <HeroSection />
      <UseCasesSection />
    </>
  );
}
