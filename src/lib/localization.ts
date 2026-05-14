type TranslateFn = (key: string, options?: { defaultValue?: string; [key: string]: unknown }) => string;

const SECTION_KEYS: Record<string, string> = {
  "Get Started": "section.getStarted",
  "Get started": "section.getStarted",
  Tutorials: "section.tutorials",
  "Compute & Hardware": "section.computeHardware",
  Datasets: "section.datasets",
  Policies: "section.policies",
  "Reward Models": "section.rewardModels",
  Inference: "section.inference",
  Simulation: "section.simulation",
  Benchmarks: "section.benchmarks",
  "Robot Processors": "section.robotProcessors",
  Robots: "section.robots",
  Teleoperators: "section.teleoperators",
  Sensors: "section.sensors",
  "Supported Hardware": "section.supportedHardware",
  Resources: "section.resources",
  About: "section.about",
  root: "section.other",
  Other: "section.other",
};

const SECTION_KO_LABELS: Record<string, string> = {
  "Get Started": "시작하기",
  "Get started": "시작하기",
  Tutorials: "튜토리얼",
  "Compute & Hardware": "컴퓨팅 및 하드웨어",
  Datasets: "데이터셋",
  Policies: "정책",
  "Reward Models": "보상 모델",
  Inference: "추론",
  Simulation: "시뮬레이션",
  Benchmarks: "벤치마크",
  "Robot Processors": "로봇 프로세서",
  Robots: "로봇",
  Teleoperators: "텔레오퍼레이터",
  Sensors: "센서",
  "Supported Hardware": "지원 하드웨어",
  Resources: "리소스",
  About: "소개",
  root: "기타",
  Other: "기타",
};

const PR_STATE_KEYS: Record<string, string> = {
  open: "activity.stateOpen",
  closed: "activity.stateClosed",
  merged: "activity.stateMerged",
};

const DATE_LOCALES: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  "zh-hant": "zh-TW",
  "zh-hans": "zh-CN",
};

const GLOSSARY_TRANSLATIONS: Record<string, { zhHant: string; zhHans: string }> = {
  Policy: { zhHant: "策略", zhHans: "策略" },
  Dataset: { zhHant: "資料集", zhHans: "数据集" },
  Training: { zhHant: "訓練", zhHans: "训练" },
  Inference: { zhHant: "推論", zhHans: "推理" },
  "Fine-tuning": { zhHant: "微調", zhHans: "微调" },
  "Pre-trained": { zhHant: "預訓練", zhHans: "预训练" },
  Checkpoint: { zhHant: "檢查點", zhHans: "检查点" },
  Feature: { zhHant: "特徵", zhHans: "特征" },
  "Learning rate": { zhHant: "學習率", zhHans: "学习率" },
  "Task conditioning": { zhHant: "任務條件化(task conditioning)", zhHans: "任务条件化(task conditioning)" },
  "One-hot": { zhHant: "獨熱(one-hot)", zhHans: "独热(one-hot)" },
  "Imitation Learning": { zhHant: "模仿學習", zhHans: "模仿学习" },
  "Reinforcement Learning": { zhHant: "強化學習", zhHans: "强化学习" },
  Teleoperation: { zhHant: "遙操作", zhHans: "遥操作" },
  "End-effector": { zhHant: "末端效應器", zhHans: "末端执行器" },
  "Proprioceptive state": { zhHant: "本體感覺狀態(proprioceptive state)", zhHans: "本体感知状态(proprioceptive state)" },
  "Follower arm": { zhHant: "跟隨臂", zhHans: "从动臂" },
  "Leader arm": { zhHant: "主控臂", zhHans: "主控臂" },
  Gripper: { zhHant: "夾爪", zhHans: "夹爪" },
  Episode: { zhHant: "回合", zhHans: "回合" },
  Action: { zhHant: "動作", zhHans: "动作" },
  Observation: { zhHant: "觀測", zhHans: "观测" },
  "Reward Model": { zhHant: "獎勵模型", zhHans: "奖励模型" },
  Processor: { zhHant: "處理器", zhHans: "处理器" },
  "Step (ProcessorStep)": { zhHant: "步驟", zhHans: "步骤" },
  "Transition (EnvTransition)": { zhHant: "轉移", zhHans: "转移" },
  Converter: { zhHant: "轉換器", zhHans: "转换器" },
  extras: { zhHant: "擴充(extras)", zhHans: "扩展(extras)" },
  Environment: { zhHant: "環境", zhHans: "环境" },
  Simulation: { zhHant: "模擬", zhHans: "仿真" },
  Benchmark: { zhHant: "基準測試", zhHans: "基准测试" },
  "Benchmark evaluation": { zhHant: "基準評估", zhHans: "基准评估" },
  "Difficulty group": { zhHant: "難度組別", zhHans: "难度组" },
  RealSense: { zhHant: "RealSense", zhHans: "RealSense" },
  Frame: { zhHant: "影格", zhHans: "帧" },
  Resolution: { zhHant: "解析度", zhHans: "分辨率" },
  "Depth map": { zhHant: "深度圖", zhHans: "深度图" },
  "Unique identifier": { zhHant: "唯一識別碼", zhHans: "唯一标识符" },
  "Auto-discovery": { zhHant: "自動探索(auto-discovery)", zhHans: "自动发现(auto-discovery)" },
  "Cleanly disconnect": { zhHant: "正確中斷連線", zhHans: "正确断开连接" },
  "Resource leak": { zhHant: "資源洩漏", zhHans: "资源泄漏" },
  "Context manager protocol": { zhHant: "上下文管理器協定", zhHans: "上下文管理器协议" },
  "Warm-up read": { zhHant: "暖機讀取", zhHans: "预热读取" },
  "Input device": { zhHant: "輸入裝置", zhHans: "输入设备" },
  "Source (OBS)": { zhHant: "輸入來源", zhHans: "输入源" },
  "Native Camera app": { zhHant: "內建相機應用程式", zhHans: "原生相机应用" },
  "Virtual camera": { zhHant: "虛擬相機", zhHans: "虚拟摄像头" },
  "Advertise (device capability)": { zhHant: "回報", zhHans: "报告" },
  Logging: { zhHant: "記錄", zhHans: "日志记录" },
};

export function getSectionTranslationKey(sectionName: string) {
  return SECTION_KEYS[sectionName];
}

export function getSectionLabel(t: TranslateFn, sectionName: string) {
  const key = getSectionTranslationKey(sectionName);
  return key ? t(key, { defaultValue: sectionName }) : sectionName;
}

export function getBilingualSectionLabel(t: TranslateFn, sectionName: string) {
  const localizedSectionName = getSectionLabel(t, sectionName);
  return localizedSectionName === sectionName
    ? sectionName
    : `${sectionName} (${localizedSectionName})`;
}

export function getSectionKoreanLabel(sectionName: string) {
  return SECTION_KO_LABELS[sectionName] || sectionName;
}

export function getPullRequestStateLabel(t: TranslateFn, state: string) {
  const key = PR_STATE_KEYS[state];
  return key ? t(key, { defaultValue: state }) : state;
}

export function getDateLocale(languageCode: string) {
  return DATE_LOCALES[languageCode] || "en-US";
}

export function getGlossaryTermTranslation(term: { en: string; ko: string }, languageCode: string) {
  const translations = GLOSSARY_TRANSLATIONS[term.en];
  if (languageCode === "zh-hant") return translations?.zhHant || term.ko;
  if (languageCode === "zh-hans") return translations?.zhHans || term.ko;
  return term.ko;
}
