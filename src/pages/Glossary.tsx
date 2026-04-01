import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GlossaryTerm {
  en: string;
  ko: string;
  category: string;
  contributor?: string;
}

const glossaryData: GlossaryTerm[] = [
  // ML General
  { en: "Policy", ko: "정책", category: "ml" },
  { en: "Dataset", ko: "데이터셋", category: "ml" },
  { en: "Training", ko: "학습", category: "ml" },
  { en: "Inference", ko: "추론", category: "ml" },
  { en: "Fine-tuning", ko: "파인튜닝", category: "ml" },
  { en: "Pre-trained", ko: "사전학습된", category: "ml" },
  { en: "Checkpoint", ko: "체크포인트", category: "ml" },
  { en: "Feature", ko: "특징", category: "ml" },
  // Robotics
  { en: "Imitation Learning", ko: "모방 학습", category: "robotics" },
  { en: "Reinforcement Learning", ko: "강화 학습", category: "robotics" },
  { en: "Teleoperation", ko: "텔레오퍼레이션", category: "robotics" },
  { en: "Episode", ko: "에피소드", category: "robotics" },
  { en: "Action", ko: "액션", category: "robotics" },
  { en: "Observation", ko: "관측", category: "robotics" },
  { en: "Reward Model", ko: "보상 모델", category: "robotics" },
  // Simulation / Environment
  { en: "Environment", ko: "환경", category: "simulation" },
  { en: "Simulation", ko: "시뮬레이션", category: "simulation" },
  { en: "Processor", ko: "프로세서", category: "hardware" },
];

const categories = [
  { value: "all", label: "전체" },
  { value: "ml", label: "ML 일반" },
  { value: "robotics", label: "로보틱스" },
  { value: "simulation", label: "시뮬레이션" },
  { value: "hardware", label: "하드웨어" },
];

const categoryColors: Record<string, string> = {
  ml: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  robotics: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  simulation: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  hardware: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = glossaryData.filter((term) => {
    const matchSearch =
      term.en.toLowerCase().includes(search.toLowerCase()) ||
      term.ko.includes(search);
    const matchCategory = category === "all" || term.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">📖 용어집 (Glossary)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          LeRobot 문서 번역에 사용되는 표준 용어 목록입니다
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="용어 검색 (영문/한국어)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Filter className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">{filtered.length}개 용어</p>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">English</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">한국어</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">카테고리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.en} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-foreground">{g.en}</td>
                  <td className="px-4 py-2.5 text-foreground">{g.ko}</td>
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    <span className={`inline-flex text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[g.category] || ""}`}>
                      {categories.find((c) => c.value === g.category)?.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Community note */}
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-5">
        <p className="text-sm text-foreground font-medium mb-1">🔒 용어 등록/수정 제안</p>
        <p className="text-xs text-muted-foreground">
          GitHub OAuth 로그인을 통한 커뮤니티 용어 관리 기능은 준비 중입니다.
          현재는 GitHub Issue에서 용어를 제안해주세요.
        </p>
        <a
          href="https://github.com/huggingface/lerobot/issues/3058"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
        >
          Issue #3058에서 제안하기
        </a>
      </div>
    </div>
  );
}
