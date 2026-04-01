import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface OverviewChartsProps {
  done: number;
  progress: number;
  pending: number;
  total: number;
}

export default function OverviewCharts({ done, progress, pending, total }: OverviewChartsProps) {
  const pct = total > 0 ? Math.round((done / total) * 1000) / 10 : 0;

  const pieData = [
    { name: "완료", value: done, color: "hsl(142, 71%, 45%)" },
    { name: "진행중", value: progress, color: "hsl(45, 93%, 47%)" },
    { name: "미번역", value: pending, color: "hsl(220, 9%, 76%)" },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">전체 진행률</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value}개`, name]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">{pct}%</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-done" />
            <span className="text-sm text-foreground">완료</span>
            <span className="text-sm font-semibold text-foreground ml-auto">{done}</span>
          </div>
          {progress > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-progress" />
              <span className="text-sm text-foreground">진행중</span>
              <span className="text-sm font-semibold text-foreground ml-auto">{progress}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-pending" />
            <span className="text-sm text-foreground">미번역</span>
            <span className="text-sm font-semibold text-foreground ml-auto">{pending}</span>
          </div>
          <div className="pt-1 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">전체</span>
              <span className="font-semibold text-foreground">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
