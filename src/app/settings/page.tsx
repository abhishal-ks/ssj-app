import ThemePicker from "@/components/ThemePicker";
import { Card, PageShell } from "@/components/ui";

export default function SettingsPage() {
  return (
    <PageShell className="py-8 sm:py-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <Card className="rounded-4xl border-border/70 bg-surface/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Personalize</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Make the space feel like yours</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Pick a visual mood and display setting that suits your writing rhythm. Every change is saved instantly for your next visit.
          </p>
        </Card>
        <ThemePicker />
      </div>
    </PageShell>
  );
}
