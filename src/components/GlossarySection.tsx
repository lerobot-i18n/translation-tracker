import { glossary } from "@/data/translationData";

export default function GlossarySection() {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-3">📖 용어집 (Glossary)</h2>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">English</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">한국어</th>
              </tr>
            </thead>
            <tbody>
              {glossary.map((g) => (
                <tr key={g.en} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2 font-medium text-foreground">{g.en}</td>
                  <td className="px-4 py-2 text-foreground">{g.ko}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
