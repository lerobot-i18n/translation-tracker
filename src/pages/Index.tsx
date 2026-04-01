import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import TranslationTable from "@/components/TranslationTable";
import GlossarySection from "@/components/GlossarySection";
import ContributeGuide from "@/components/ContributeGuide";
import DashboardFooter from "@/components/DashboardFooter";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <StatsCards />
        <TranslationTable />
        <GlossarySection />
        <ContributeGuide />
      </main>
      <DashboardFooter />
    </div>
  );
}
