# LeRobot 한국어 번역 가이드

> **이슈:** [#3058 🌐 [i18n-KO] Translating docs to Korean](https://github.com/huggingface/lerobot/issues/3058)  
> **대시보드:** https://lerobot-korean-watch.lovable.app  
> **관리자:** [@1wos](https://github.com/1wos)

---

## 📌 목차

1. [번역 워크플로우](#번역-워크플로우)
2. [문체 가이드라인](#문체-가이드라인)
3. [용어 번역 규칙](#용어-번역-규칙)
4. [포맷 규칙](#포맷-규칙)
5. [참고 자료](#참고-자료)
6. [자주 하는 실수](#자주-하는-실수)

---

## 번역 워크플로우

### 1. 파일 선택
- [대시보드](https://lerobot-korean-watch.lovable.app)에서 **미번역** 파일 찾기
- [이슈 #3058](https://github.com/huggingface/lerobot/issues/3058)에 댓글
  - 예: `I'll take installation.mdx`

### 2. Fork & Clone
```bash
# huggingface/lerobot을 본인 계정으로 Fork 후
git clone https://github.com/<본인아이디>/lerobot.git
cd lerobot
git remote add upstream https://github.com/huggingface/lerobot.git
```

### 3. 브랜치 생성 (**파일 1개 = 브랜치 1개**)
```bash
git checkout main
git pull upstream main
git checkout -b i18n-ko/<filename>
```

### 4. 번역 작업
```bash
mkdir -p docs/source/ko
cp docs/source/<filename>.mdx docs/source/ko/<filename>.mdx
# 번역 진행
```

### 5. 포맷 체크 & 커밋
```bash
pre-commit run --all-files
git add docs/source/ko/<filename>.mdx
git commit -m "docs(i18n): add Korean translation for <filename>.mdx"
git push origin i18n-ko/<filename>
```

### 6. PR 생성
- **제목:** `docs(i18n): add Korean translation for <filename>.mdx`
- **본문:** `Part of #3058`
- **파일 1개당 PR 1개** 원칙

---

## 문체 가이드라인

### 기본 원칙: HuggingFace Transformers 한국어 스타일 준수

| 상황 | 권장 문체 | 예시 |
|------|----------|------|
| **사용자에게 요청** | `~해주세요` | `참고해주세요`, `실행해주세요`, `확인해주세요` |
| **사실 선언** | `~합니다` | `제공합니다`, `지원합니다`, `포함됩니다` |
| **피해야 할 것** | `~하십시오` (너무 격식) | ~~`참고하십시오`~~ → `참고해주세요` |
| **피해야 할 것** | `~하세요` (반말 느낌) | ~~`실행하세요`~~ → `실행해주세요` |

### ✅ 좋은 예시
```
LeRobot을 설치하려면 [설치 가이드](./installation)를 참고해주세요.
🤗 LeRobot은 PyTorch 기반의 모델을 제공합니다.
추가 기능을 설치하려면 다음 명령을 실행해주세요.
```

### ❌ 피할 예시
```
LeRobot을 설치하려면 [설치 가이드](./installation)를 참고하세요.  ← ~하세요
🤗 LeRobot은 PyTorch 기반의 모델을 제공하고 있음.  ← 종결어미 이상
추가 기능을 설치하려면 다음 명령을 실행하십시오.  ← 너무 격식
```

---

## 용어 번역 규칙

### 1. 한영 병기 (첫 등장 시에만)

**필요한 경우:** 혼동 가능한 기술 용어
```
모방 학습(Imitation Learning)
액션 청크(action chunk)
팔꿈치 굽힘(Elbow Flex)
```

**불필요한 경우:** 이미 한국어로 자리잡은 용어
```
✅ 학습 (O)       ❌ 학습(training) (X)
✅ 파인튜닝 (O)   ❌ 파인튜닝(Fine-tuning) (X)  (이미 통용)
✅ 데이터셋 (O)   ❌ 데이터셋(dataset) (X)
```

### 2. 용어 통일 표

| 영문 | 한국어 | 비고 |
|------|--------|------|
| policy | 정책 | |
| dataset | 데이터셋 | 병기 불필요 |
| training | 학습 | 병기 불필요 |
| fine-tuning | 파인튜닝 | 병기 불필요 |
| inference | 추론 | |
| checkpoint | 체크포인트 | |
| feature | 특징 또는 피처 | 문맥에 따라 |
| imitation learning | 모방 학습 | |
| reinforcement learning | 강화 학습 | |
| teleoperation | 텔레오퍼레이션 | |
| episode | 에피소드 | |
| action | 액션 | |
| observation | 관측 | |
| reward model | 보상 모델 | |
| environment | 환경 | |
| simulation | 시뮬레이션 | |
| processor | 프로세서 | |
| follower arm | 팔로워 암 | **띄어쓰기 필수** |
| leader arm | 리더 암 | **띄어쓰기 필수** |
| virtual environment | 가상 환경 | **띄어쓰기 필수** |
| gripper | 그리퍼 | |
| chunk | 청크(chunk) | 첫 등장 시 병기 |
| flagship | 대표 / 주력 | |
| extras | 선택적 기능(extras) | 첫 등장 시 병기 |

### 3. 관절/축 용어 (모터 관련)

**권장 스타일:** 한국어 + 영문 병기
```
✅ 어깨 회전 (Shoulder Pan)
✅ 어깨 들기 (Shoulder Lift)
✅ 팔꿈치 굽힘 (Elbow Flex)
✅ 손목 굽힘 (Wrist Flex)
✅ 손목 회전 (Wrist Roll)
```

**피할 것:**
- ❌ 음역만 사용: `엘보 플렉스`
- ❌ 혼용: `엘보 플렉스` + `손목 굽힘` (같은 "Flex"인데 다름)

---

## 포맷 규칙

### 1. 코드/URL/변수명 영어 유지
```python
# ✅ 코드 블록은 영어 그대로
config = SO101FollowerConfig(
    port="/dev/tty.usbmodem",
    id="my_awesome_follower_arm",  # 변수명 영어 유지
)
```

```bash
# ✅ 명령어는 영어 그대로
pip install -e ".[feetech]"
```

### 2. 코드 내 주석은 한국어로 번역
```bash
lerobot-record \
    --robot.port=/dev/tty.usbmodem  # <- 이전 단계에서 찾은 포트 입력
```

### 3. 콜론 앞 공백 제거 (한국어 맞춤법)
```
✅ "설치해야 합니다:"       (공백 없음)
❌ "설치해야 합니다 :"      (공백 있음 - 영어식)
```

### 4. 원본 구조 유지
- **헤딩 레벨 동일** (`#`, `##`, `###`)
- **마크다운 문법 유지** (`**굵게**`, `_기울임_`, `` `코드` ``)
- **이미지/비디오 URL 유지**
- **이미지 `alt` 속성은 번역 가능**
  ```html
  alt="Pi0 개요"  ← 한국어 OK
  ```

### 5. 라인 대응 (권장)
- 원본과 유사한 줄 수 유지 권장 (엄격하진 않음)
- 원문에 없는 내용 추가 자제
  - ❌ `"시작하기에 앞서"` 같은 추가 표현
  - ✅ 원문 의미 그대로 번역

### 6. `> [!NOTE]`, `> [!TIP]` 등 callout 블록
- 내부 내용 번역, 태그는 그대로
```markdown
> [!TIP]
> 각 단계마다 Enter를 누르기 전에 케이블 연결 상태를 확인해주세요.
```

---

## 참고 자료

### HuggingFace Transformers 한국어 번역
- https://github.com/huggingface/transformers/tree/main/docs/source/ko
- 67개 파일 번역되어 있음
- **우리의 스타일 참고 대상**

### 쿠버네티스 한글화 가이드
- https://kubernetes.io/ko/docs/contribute/localization_ko/
- 한영 병기 규칙 참고

### 오픈소스 문서 번역 일반
- 원문에 충실하되 자연스러운 한국어 우선
- 기계번역 지양, 의미 파악 후 재구성

---

## 자주 하는 실수

### 1. 문체 혼용
```
❌ 한 파일 내에 "~하십시오"와 "~하세요" 혼용
✅ "~해주세요"로 통일
```

### 2. 용어 불일치
```
❌ 같은 파일에서 "엘보 플렉스" / "손목 굽힘" 혼용
✅ 한쪽으로 통일 (번역 스타일 유지)
```

### 3. 띄어쓰기
```
❌ 팔로워암, 가상환경
✅ 팔로워 암, 가상 환경
```

### 4. 콜론 앞 공백
```
❌ "설치합니다 :"
✅ "설치합니다:"
```

### 5. 수동형 번역체
```
❌ "설명을 찾아볼 수 있습니다" (can be found)
✅ "설명합니다" (we explain)
```

### 6. 불필요한 한영 병기
```
❌ "학습(training)한 신경망"
✅ "학습한 신경망"
```

### 7. 원문에 없는 내용 추가
```
❌ "시작하기에 앞서, 이 README를 읽어주세요"
✅ "이 README를 참고해주세요" (원문 "Follow this README")
```

### 8. 문장 과도한 분할
- 원문 1문장 → 한글 3문장 등 과도한 분할 자제
- 자연스럽게 읽히면 2~3문장으로 나누는 것도 가능

---

## 리뷰 체크리스트

번역 완료 후 셀프 체크:

- [ ] 문체 통일됨 (`~해주세요` / `~합니다`)
- [ ] 용어 일관성 (같은 단어 같은 번역)
- [ ] 띄어쓰기 통일 (팔로워 암, 가상 환경 등)
- [ ] 콜론 앞 공백 제거
- [ ] 코드 블록 영어 유지
- [ ] 주석 한국어 번역
- [ ] 헤딩 구조 원본과 동일
- [ ] 원문에 없는 내용 추가 없음
- [ ] 한영 병기 적절 (첫 등장 + 생소한 용어만)
- [ ] pre-commit 통과
- [ ] PR 제목 규칙 (`docs(i18n): add Korean translation for <filename>.mdx`)
- [ ] PR 본문에 `Part of #3058`

---

## 커밋 메시지 컨벤션

```
docs(i18n): add Korean translation for <filename>.mdx
```

예시:
- `docs(i18n): add Korean translation for pi0fast.mdx`
- `docs(i18n): add Korean translation for peft_training.mdx`
- `docs(i18n): sync installation.mdx with latest English source`
- `docs(i18n): unify formality in act.mdx`

---

## 문의

- **GitHub:** [@1wos](https://github.com/1wos)
- **Email:** 1wosomm1@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/someee/

즐거운 번역되세요! 🙌
