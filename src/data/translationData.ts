export type TranslationStatus = "done" | "review" | "translating" | "pending";

export interface TranslationFile {
  filename: string;
  title: string;
  status: TranslationStatus;
  assignee?: string;
  pr?: string;
}

export interface TranslationSection {
  name: string;
  nameKo: string;
  files: TranslationFile[];
}

export const sections: TranslationSection[] = [
  {
    name: "Get Started",
    nameKo: "시작하기",
    files: [
      { filename: "index.mdx", title: "LeRobot", status: "done", assignee: "@1wos", pr: "#3126" },
      { filename: "installation.mdx", title: "Installation", status: "done", assignee: "@1wos" },
    ],
  },
  {
    name: "Tutorials",
    nameKo: "튜토리얼",
    files: [
      { filename: "il_robots.mdx", title: "Imitation Learning for Robots", status: "done", assignee: "@1wos" },
      { filename: "bring_your_own_policies.mdx", title: "Bring Your Own Policies", status: "pending" },
      { filename: "integrate_hardware.mdx", title: "Bring Your Own Hardware", status: "pending" },
      { filename: "hilserl.mdx", title: "Train a Robot with RL", status: "pending" },
      { filename: "hilserl_sim.mdx", title: "Train RL in Simulation", status: "pending" },
      { filename: "multi_gpu_training.mdx", title: "Multi GPU Training", status: "pending" },
      { filename: "peft_training.mdx", title: "Training with PEFT (e.g., LoRA)", status: "pending" },
      { filename: "rename_map.mdx", title: "Using Rename Map and Empty Cameras", status: "pending" },
    ],
  },
  {
    name: "Datasets",
    nameKo: "데이터셋",
    files: [
      { filename: "lerobot-dataset-v3.mdx", title: "Using LeRobotDataset", status: "pending" },
      { filename: "porting_datasets_v3.mdx", title: "Porting Large Datasets", status: "pending" },
      { filename: "using_dataset_tools.mdx", title: "Using the Dataset Tools", status: "pending" },
      { filename: "dataset_subtask.mdx", title: "Using Subtasks in the Dataset", status: "pending" },
      { filename: "streaming_video_encoding.mdx", title: "Streaming Video Encoding", status: "pending" },
    ],
  },
  {
    name: "Policies",
    nameKo: "정책",
    files: [
      { filename: "act.mdx", title: "ACT", status: "done", assignee: "@1wos" },
      { filename: "smolvla.mdx", title: "SmolVLA", status: "done", assignee: "@1wos" },
      { filename: "pi0.mdx", title: "π₀ (Pi0)", status: "done", assignee: "@1wos" },
      { filename: "pi0fast.mdx", title: "π₀-FAST (Pi0Fast)", status: "pending" },
      { filename: "pi05.mdx", title: "π₀.₅ (Pi05)", status: "pending" },
      { filename: "groot.mdx", title: "NVIDIA GR00T N1.5", status: "pending" },
      { filename: "xvla.mdx", title: "X-VLA", status: "pending" },
      { filename: "multi_task_dit.mdx", title: "Multitask DiT Policy", status: "pending" },
      { filename: "walloss.mdx", title: "WALL-OSS", status: "pending" },
    ],
  },
  {
    name: "Reward Models",
    nameKo: "보상 모델",
    files: [
      { filename: "sarm.mdx", title: "SARM", status: "pending" },
    ],
  },
  {
    name: "Inference",
    nameKo: "추론",
    files: [
      { filename: "async.mdx", title: "Use Async Inference", status: "pending" },
      { filename: "rtc.mdx", title: "Real-Time Chunking (RTC)", status: "pending" },
    ],
  },
  {
    name: "Simulation",
    nameKo: "시뮬레이션",
    files: [
      { filename: "envhub.mdx", title: "Environments from the Hub", status: "pending" },
      { filename: "envhub_leisaac.mdx", title: "Control & Train Robots in Sim (LeIsaac)", status: "pending" },
      { filename: "envhub_isaaclab_arena.mdx", title: "NVIDIA IsaacLab Arena Environments", status: "pending" },
      { filename: "libero.mdx", title: "Using Libero", status: "pending" },
      { filename: "metaworld.mdx", title: "Using MetaWorld", status: "pending" },
    ],
  },
  {
    name: "Robot Processors",
    nameKo: "로봇 프로세서",
    files: [
      { filename: "introduction_processors.mdx", title: "Introduction to Robot Processors", status: "pending" },
      { filename: "debug_processor_pipeline.mdx", title: "Debug Your Processor Pipeline", status: "pending" },
      { filename: "implement_your_own_processor.mdx", title: "Implement Your Own Processor", status: "pending" },
      { filename: "processors_robots_teleop.mdx", title: "Processors for Robots and Teleoperators", status: "pending" },
      { filename: "env_processor.mdx", title: "Environment Processors", status: "pending" },
    ],
  },
  {
    name: "Robots",
    nameKo: "로봇",
    files: [
      { filename: "so101.mdx", title: "SO-101", status: "pending" },
      { filename: "so100.mdx", title: "SO-100", status: "pending" },
      { filename: "koch.mdx", title: "Koch v1.1", status: "pending" },
      { filename: "lekiwi.mdx", title: "LeKiwi", status: "pending" },
      { filename: "hope_jr.mdx", title: "Hope Jr", status: "pending" },
      { filename: "reachy2.mdx", title: "Reachy 2", status: "pending" },
      { filename: "unitree_g1.mdx", title: "Unitree G1", status: "pending" },
      { filename: "earthrover_mini_plus.mdx", title: "Earth Rover Mini", status: "pending" },
      { filename: "omx.mdx", title: "OMX", status: "pending" },
      { filename: "openarm.mdx", title: "OpenArm", status: "pending" },
    ],
  },
  {
    name: "Teleoperators",
    nameKo: "텔레오퍼레이터",
    files: [
      { filename: "phone_teleop.mdx", title: "Phone", status: "pending" },
    ],
  },
  {
    name: "Sensors",
    nameKo: "센서",
    files: [
      { filename: "cameras.mdx", title: "Cameras", status: "pending" },
    ],
  },
  {
    name: "Supported Hardware",
    nameKo: "지원 하드웨어",
    files: [
      { filename: "torch_accelerators.mdx", title: "PyTorch Accelerators", status: "pending" },
    ],
  },
  {
    name: "Resources",
    nameKo: "리소스",
    files: [
      { filename: "notebooks.mdx", title: "Notebooks", status: "pending" },
      { filename: "feetech.mdx", title: "Updating Feetech Firmware", status: "pending" },
      { filename: "damiao.mdx", title: "Damiao Motors and CAN Bus", status: "pending" },
    ],
  },
  {
    name: "About",
    nameKo: "소개",
    files: [
      { filename: "backwardcomp.mdx", title: "Backward Compatibility", status: "pending" },
    ],
  },
];

export const glossary = [
  { en: "Policy", ko: "정책" },
  { en: "Dataset", ko: "데이터셋" },
  { en: "Training", ko: "학습" },
  { en: "Inference", ko: "추론" },
  { en: "Imitation Learning", ko: "모방 학습" },
  { en: "Reinforcement Learning", ko: "강화 학습" },
  { en: "Teleoperation", ko: "텔레오퍼레이션" },
  { en: "Processor", ko: "프로세서" },
  { en: "Environment", ko: "환경" },
  { en: "Simulation", ko: "시뮬레이션" },
  { en: "Reward Model", ko: "보상 모델" },
  { en: "Fine-tuning", ko: "파인튜닝" },
  { en: "Pre-trained", ko: "사전학습된" },
  { en: "Checkpoint", ko: "체크포인트" },
  { en: "Episode", ko: "에피소드" },
  { en: "Action", ko: "액션" },
  { en: "Observation", ko: "관측" },
  { en: "Feature", ko: "특징" },
];

export function getStats() {
  const allFiles = sections.flatMap((s) => s.files);
  const total = allFiles.length;
  const done = allFiles.filter((f) => f.status === "done").length;
  const progress = allFiles.filter((f) => f.status === "outdated").length;
  const pending = allFiles.filter((f) => f.status === "pending").length;
  return { total, done, progress, pending };
}
