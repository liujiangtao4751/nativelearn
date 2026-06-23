import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpenText,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Crop,
  Edit3,
  EyeOff,
  Flame,
  Gift,
  Home,
  Image,
  Languages,
  Lightbulb,
  ListChecks,
  Mic,
  Move,
  NotebookPen,
  PenLine,
  RotateCcw,
  Save,
  ScanLine,
  ShieldAlert,
  Sigma,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Users,
  Video,
  Volume2,
} from "lucide-react";
import { getDailyQuote } from "./dailyQuotes";
import "./styles.css";

const childProfiles = [
  {
    id: "older",
    name: "哥哥",
    avatar: "原",
    grade: "三年级",
    totalPoints: 3860,
    rewardTarget: 4200,
    strongestChar: "原",
    writingStreak: 12,
    englishStreak: 100,
    mathStreak: 200,
    diaryStreak: 4,
    writingScore: 94,
    followScore: 86,
    lastEpisode: "Bluey · S01 E04",
    diaryState: "未主动记录",
  },
  {
    id: "younger",
    name: "弟弟",
    avatar: "习",
    grade: "一年级",
    totalPoints: 1288,
    rewardTarget: 1800,
    strongestChar: "山",
    writingStreak: 5,
    englishStreak: 18,
    mathStreak: 21,
    diaryStreak: 2,
    writingScore: 89,
    followScore: 78,
    lastEpisode: "Bluey · S01 E02",
    diaryState: "未主动记录",
  },
];

const tabs = [
  { id: "practice", label: "练字", icon: PenLine },
  { id: "english", label: "英语", icon: Languages },
  { id: "math", label: "数学", icon: Sigma },
  { id: "diary", label: "日记", icon: NotebookPen },
  { id: "mine", label: "我的", icon: CircleUserRound },
];

const passLabels = ["无字幕听", "英文校准", "跟读录音", "去默写"];
const englishWordItems = [
  { word: "carry", phonetic: "/ˈkeri/", count: "8x" },
  { word: "small", phonetic: "/smɔːl/", count: "6x" },
  { word: "box", phonetic: "/bɑːks/", count: "5x" },
];
const classicLine = {
  text: "I can carry the small box.",
  rhythm: "ˈI can / ˈcarry‿the / ˈsmall ˈbox //",
  phonetics: "I /aɪ/ · can /kən/ · carry /ˈkeri/ · the /ðə/ · small /smɔːl/ · box /bɑːks/",
};

function App() {
  const [activeTab, setActiveTab] = useState("practice");
  const [role, setRole] = useState("child");
  const [childIndex, setChildIndex] = useState(0);
  const [practiceDone, setPracticeDone] = useState(false);
  const [englishPass, setEnglishPass] = useState(1);
  const [maskEnabled, setMaskEnabled] = useState(true);
  const [mathChoice, setMathChoice] = useState("");
  const [diarySaved, setDiarySaved] = useState(false);
  const [diaryDraft, setDiaryDraft] = useState(
    "今天我完成了练字、英语和数学。练字时我发现“习”的横折钩容易向右跑，明天想慢一点写。"
  );

  const child = childProfiles[childIndex];
  const todayPoints =
    child.writingStreak +
    child.englishStreak +
    child.mathStreak +
    child.diaryStreak +
    7;

  const switchChild = () => {
    setChildIndex((value) => (value + 1) % childProfiles.length);
    setMathChoice("");
    setPracticeDone(false);
    setDiarySaved(false);
  };

  return (
    <main className="app-shell">
      <section className={`phone-frame ${role === "parent" ? "parent-mode" : ""}`}>
        <Topbar
          child={child}
          role={role}
          onSwitchChild={switchChild}
          onToggleRole={() => setRole((value) => (value === "child" ? "parent" : "child"))}
        />

        {role === "parent" ? (
          <ParentView child={child} todayPoints={todayPoints} />
        ) : (
          <>
            <div className="scroll-area child-page-scroll">
              <FeaturePanel
                activeTab={activeTab}
                child={child}
                todayPoints={todayPoints}
                practiceDone={practiceDone}
                setPracticeDone={setPracticeDone}
                englishPass={englishPass}
                setEnglishPass={setEnglishPass}
                maskEnabled={maskEnabled}
                setMaskEnabled={setMaskEnabled}
                mathChoice={mathChoice}
                setMathChoice={setMathChoice}
                diaryDraft={diaryDraft}
                setDiaryDraft={setDiaryDraft}
                diarySaved={diarySaved}
                setDiarySaved={setDiarySaved}
              />
            </div>

            <nav className="tabbar" aria-label="主导航">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const hasDot = tab.id === "diary" && !diarySaved;
                return (
                  <button
                    key={tab.id}
                    className={activeTab === tab.id ? "active" : ""}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-icon">
                      <Icon size={20} />
                      {hasDot && <i />}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </>
        )}
      </section>
    </main>
  );
}

function Topbar({ child, role, onSwitchChild, onToggleRole }) {
  return (
    <header className="topbar">
      <div className="brand">
        <img
          className="brand-logo"
          src={`${import.meta.env.BASE_URL}icons/nativelearn-brand-logo.png`}
          alt="原习 NativeLearn"
        />
      </div>
      <div className="top-actions">
        <button className="top-pill" onClick={onSwitchChild} aria-label="切换孩子">
          <Users size={15} />
          <span>{child.name}</span>
          <ChevronDown size={13} />
        </button>
        <button className="role-pill" onClick={onToggleRole} aria-label="切换角色">
          {role === "child" ? <ShieldAlert size={16} /> : <CircleUserRound size={16} />}
          <span>{role === "child" ? "家长" : "孩子"}</span>
        </button>
      </div>
    </header>
  );
}

function TaskChip({ label, value, done, alert }) {
  return (
    <span className={`task-chip ${done ? "done" : ""} ${alert ? "alert" : ""}`}>
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  );
}

function FeaturePanel(props) {
  if (props.activeTab === "practice") {
    return <PracticePanel {...props} />;
  }
  if (props.activeTab === "english") {
    return <EnglishPanel {...props} />;
  }
  if (props.activeTab === "math") {
    return <MathPanel {...props} />;
  }
  if (props.activeTab === "diary") {
    return <DiaryPanel {...props} />;
  }
  return <MinePanel {...props} />;
}

function PanelShell({ icon: Icon, title, subtitle, children, action }) {
  return (
    <section className="detail-panel">
      <div className="panel-title">
        <span>
          <Icon size={18} />
        </span>
        <div>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function PracticePanel({ child, practiceDone, setPracticeDone }) {
  const feedback = practiceDone
    ? [
        { char: "原", state: "优秀", detail: "中心稳定，撇捺舒展", tone: "good" },
        { char: "习", state: "-4", detail: "横折钩略向右跑", tone: "warn" },
        { char: "水", state: "-2", detail: "捺脚稍短，收笔可放开", tone: "warn" },
      ]
    : [
        { char: "原", state: "待评", detail: "完成练习页拍照后生成逐字反馈", tone: "idle" },
      ];

  return (
    <PanelShell icon={Camera} title="练字流程" subtitle="目标字帖页作为参照，不内置商业字库">
      <div className="timeline">
        <Step done title="拍目标字帖页" detail="家长购买的字帖可直接作为评分参照" />
        <Step done title="自动处理图像" detail="裁切、透视矫正、光线检测" />
        <Step done={practiceDone} title="拍练习页确认" detail="上传后 AI 对照目标页逐字评分" />
      </div>

      <div className="writing-compare" aria-label="练字照片对比">
        <PhotoPanel title="目标字帖页" icon={BookOpenText} />
        <PhotoPanel title="练习拍照页" icon={Camera} scored={practiceDone} />
      </div>

      <div className="score-strip">
        <div>
          <span>AI 临摹评分</span>
          <strong>{practiceDone ? child.writingScore : "--"}</strong>
        </div>
        <p>
          {practiceDone
            ? "本次字形贴合度高，扣分集中在局部收笔和结构偏移。"
            : "完成练习拍照后，系统会标出扣分字、优秀字和具体原因。"}
        </p>
      </div>

      <div className="feedback-list">
        {feedback.map((item) => (
          <div className={`feedback-item ${item.tone}`} key={`${item.char}-${item.state}`}>
            <strong>{item.char}</strong>
            <span>{item.state}</span>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>

      <div className="control-row">
        <button className="secondary-action compact">
          <Crop size={17} />
          重拍目标页
        </button>
        <button className="secondary-action compact" onClick={() => setPracticeDone(true)}>
          <Camera size={17} />
          完成并评分
        </button>
      </div>
      <div className="storage-line">
        <Image size={16} />
        <span>练习照片永久保存，可批量选择、查看和删除。</span>
        <Trash2 size={15} />
      </div>
    </PanelShell>
  );
}

function PhotoPanel({ title, icon: Icon, scored }) {
  return (
    <div className="photo-panel">
      <div className="photo-head">
        <Icon size={15} />
        <span>{title}</span>
      </div>
      <div className="paper-grid">
        {["原", "习", "山", "水"].map((char, index) => (
          <span className={scored && index === 1 ? "mark-warn" : scored && index === 0 ? "mark-good" : ""} key={char}>
            {char}
          </span>
        ))}
      </div>
      <div className="photo-tools">
        <span>
          <ScanLine size={13} />
          已校正
        </span>
        <span>
          <Check size={13} />
          光线可用
        </span>
      </div>
    </div>
  );
}

function EnglishPanel({
  child,
  englishPass,
  setEnglishPass,
  maskEnabled,
  setMaskEnabled,
}) {
  const isDictation = englishPass === 4;
  const maskClass = maskEnabled && !isDictation ? `mask-pass-${englishPass}` : "mask-off";

  return (
    <PanelShell
      icon={Languages}
      title="英语输入"
      subtitle="界面可中文，学习内容只保留英语"
      action={
        <button className="mini-action" onClick={() => setMaskEnabled((value) => !value)}>
          <EyeOff size={15} />
          {maskEnabled ? "遮挡开" : "遮挡关"}
        </button>
      }
    >
      <div className="episode-row">
        <div>
          <span>当前素材</span>
          <strong>{child.lastEpisode}</strong>
        </div>
        <button>
          <Clock3 size={15} />
          继续
        </button>
      </div>

      <div className="video-box">
        <div className="video-scene">
          <span>Episode 04</span>
          <strong>Can I help?</strong>
        </div>
        {!isDictation && (
          <div className="hard-subtitles">
            <span>{classicLine.text}</span>
            <span> </span>
          </div>
        )}
        {maskEnabled && !isDictation && (
          <div className={`subtitle-mask ${maskClass}`}>
            <Move size={14} />
            <span>MASK</span>
          </div>
        )}
      </div>

      <div className="rounds">
        {passLabels.map((item, index) => (
          <button
            className={englishPass === index + 1 ? "current" : ""}
            key={item}
            onClick={() => setEnglishPass(index + 1)}
          >
            {index + 1}. {item}
          </button>
        ))}
      </div>

      <div className="mask-guide">
        <span>
          {englishPass === 1
            ? "第1遍：遮中英硬字幕"
            : isDictation
              ? "第4步：听音默写，不显示答案"
              : "第2/3遍：只遮中文区域"}
        </span>
        <strong>{isDictation ? "完整单词和整句" : "位置会按本集记忆"}</strong>
      </div>

      {isDictation ? (
        <div className="dictation-area listening">
          <div className="pack-head">
            <Mic size={16} />
            <span>听音默写</span>
          </div>
          <p className="dictation-note">先听原声或 AI 朗读，再完整写出 3 个单词和 1 句台词。</p>
          <div className="listen-dictation-list">
            {englishWordItems.map((item, index) => (
              <DictationCard key={item.word} label={`Word ${index + 1}`} placeholder="Type the full word" />
            ))}
            <DictationCard label="Classic line" placeholder="Type the full sentence" long />
          </div>
          <strong>完成 3 个单词和 1 句台词后提交；跟读 {child.followScore} 分，完整学习 +2。</strong>
        </div>
      ) : (
        <div className="learning-pack">
          <div className="pack-head">
            <Sparkles size={16} />
            <span>三遍后生成</span>
          </div>
          <div className="word-grid">
            {englishWordItems.map((item) => (
              <WordCard key={item.word} {...item} />
            ))}
          </div>
          <div className="line-card">
            <div className="learning-card-head">
              <span>Classic line</span>
              <ListenButton />
            </div>
            <strong>{classicLine.text}</strong>
            <small>{classicLine.rhythm}</small>
            <p>{classicLine.phonetics}</p>
          </div>
        </div>
      )}
    </PanelShell>
  );
}

function WordCard({ word, phonetic, count }) {
  return (
    <div className="word-card">
      <div className="learning-card-head">
        <strong>{word}</strong>
        <ListenButton />
      </div>
      <span>{phonetic}</span>
      <small>{count}</small>
    </div>
  );
}

function ListenButton() {
  return (
    <span className="segmented-audio" role="group" aria-label="音频播放">
      <button className="segmented-audio-part source" type="button" aria-label="原声播放">
        <Volume2 size={13} />
        <span>原声</span>
      </button>
      <button className="segmented-audio-part ai" type="button" aria-label="AI播放">
        <span>AI</span>
      </button>
    </span>
  );
}

function DictationCard({ label, placeholder, long }) {
  return (
    <div className={`dictation-card ${long ? "long" : ""}`}>
      <div className="learning-card-head">
        <span>{label}</span>
        <ListenButton />
      </div>
      <input aria-label={label} placeholder={placeholder} />
    </div>
  );
}

function MathPanel({ child, mathChoice, setMathChoice }) {
  const isRight = mathChoice === "3/4";
  const hasAnswered = Boolean(mathChoice);

  return (
    <PanelShell icon={Sigma} title="数学大师 · 刘徽" subtitle={`${child.grade}档案自动带入，不再单独选择`}>
      <div className="mentor-line">
        <div className="mentor-avatar">刘</div>
        <p>先追问“整体是什么”，再判断孩子卡在概念、策略还是表达。</p>
      </div>

      <div className="question-box">
        <span>{child.grade} · 分数与面积 · 今日第 1/3 题</span>
        <strong>一个正方形花园被分成 4 个相同的小正方形，其中 3 块种了花。把花园旋转以后，种花部分还是几分之几？</strong>
      </div>

      <div className="math-diagram" aria-label="四等分花园图">
        <span className="filled" />
        <span className="filled" />
        <span className="filled" />
        <span />
      </div>

      <div className="answer-grid">
        {["1/4", "2/3", "3/4"].map((item) => (
          <button
            className={`${mathChoice === item ? "selected" : ""} ${hasAnswered && item === "3/4" ? "right" : ""}`}
            key={item}
            onClick={() => setMathChoice(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={`diagnosis ${hasAnswered ? (isRight ? "right" : "wrong") : ""}`}>
        <Lightbulb size={16} />
        <p>
          {hasAnswered
            ? isRight
              ? "刘徽：判断正确。旋转不会改变整体被占的比例，下一题可以提高到比较 3/4 和 2/3。"
              : "刘徽：先确认整体被平均分成几份，再数种花的份数。错题会进入复习队列。"
            : "作答后，大师会判断是整体概念、等分概念，还是表达方式卡住。"}
        </p>
      </div>

      <div className="input-types">
        {["选择题", "数字", "分数", "单位", "拖拽配对", "草稿纸"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="review-line">
        <RotateCcw size={16} />
        <span>错题复习：当天补救 · 次日 · 第3天 · 第7天 · 第14天 · 第30天</span>
      </div>
    </PanelShell>
  );
}

function DiaryPanel({ diaryDraft, setDiaryDraft, diarySaved, setDiarySaved }) {
  const saveWhenLeavingEditor = (event) => {
    if (!event.target.closest(".diary-editor")) {
      setDiarySaved(true);
    }
  };

  return (
    <PanelShell icon={NotebookPen} title="成长日记" subtitle="不强制，未主动记录时用红点轻提醒">
      <div className="diary-save-zone" onPointerDownCapture={saveWhenLeavingEditor}>
        <div className="prompt-box">
          <Sparkles size={18} />
          <p>AI 已根据今天的练字、英语和数学生成草稿。孩子可以直接改，点到编辑区外自动保存。</p>
        </div>

        <textarea
          className="diary-editor"
          value={diaryDraft}
          onChange={(event) => setDiaryDraft(event.target.value)}
          onBlur={() => setDiarySaved(true)}
          aria-label="日记编辑区"
        />

        <div className="editor-status">
          <span>
            <Save size={15} />
            {diarySaved ? "已自动保存" : "编辑后离开自动保存"}
          </span>
          <strong>{diarySaved ? "优质日记 +2" : "主动记录 +1"}</strong>
        </div>

        <div className="media-row">
          <button>
            <Mic size={18} />
            录音
          </button>
          <button>
            <Edit3 size={18} />
            打字
          </button>
          <button>
            <Camera size={18} />
            拍照
          </button>
          <button>
            <Video size={18} />
            视频
          </button>
        </div>

        <div className="risk-note">
          <ShieldAlert size={16} />
          <span>若出现欺凌、伤害、自伤等强风险，只提醒家长关注，不做医学或心理诊断。</span>
        </div>
      </div>
    </PanelShell>
  );
}

function MinePanel({ child, todayPoints }) {
  const rewardProgress = Math.min(100, Math.round((child.totalPoints / child.rewardTarget) * 100));
  const dailyQuote = getDailyQuote(child.id);

  return (
    <PanelShell icon={Home} title="我的成长" subtitle="积分、奖励、缓存和成长数据">
      <div className="mine-today">
        <div>
          <p>归原而习，日进一寸</p>
          <strong>今日数据总览</strong>
          <span>{child.name}今天完成四个方向后，预计可得 {todayPoints} 分以上。</span>
        </div>
        <Star size={24} />
      </div>

      <div className="daily-quote-card" aria-label="每日名言">
        <div className="daily-quote-head">
          <span>今日一句</span>
          <small>全球 TOP{dailyQuote.poolTotal}</small>
        </div>
        <p className="quote-cn">{dailyQuote.zh}</p>
        <p className="quote-en">{dailyQuote.en}</p>
        <span className="quote-source">
          {dailyQuote.sourceZh} · {dailyQuote.sourceEn}
        </span>
      </div>

      <div className="today-tasks mine-task-grid" aria-label="今日任务数据">
        <TaskChip label="练字" value={`+${child.writingStreak}`} done />
        <TaskChip label="英语" value={`+${child.englishStreak}`} />
        <TaskChip label="数学" value={`+${child.mathStreak}`} />
        <TaskChip label="日记" value={`+${child.diaryStreak}`} alert />
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{child.avatar}</div>
        <div>
          <strong>{child.name}</strong>
          <span>{child.grade}</span>
        </div>
        <Flame size={26} />
      </div>

      <div className="reward-box">
        <div>
          <span>延迟满足奖励</span>
          <strong>{child.totalPoints} / {child.rewardTarget}</strong>
        </div>
        <ProgressBar value={`${rewardProgress}%`} />
        <p>1积分=1分钱；家庭奖励由家长配置和兑现。</p>
      </div>

      <div className="streak-list">
        <StreakRow label="练字连续" value={child.writingStreak} />
        <StreakRow label="英语连续" value={child.englishStreak} />
        <StreakRow label="数学连续" value={child.mathStreak} />
        <StreakRow label="日记连续" value={child.diaryStreak} />
      </div>

      <div className="offline-box">
        <ListChecks size={17} />
        <span>PWA 离线缓存：应用壳、孩子档案、任务状态、积分和最近进度；视频素材 P0 不默认离线缓存。</span>
      </div>
    </PanelShell>
  );
}

function ParentView({ child, todayPoints }) {
  return (
    <div className="scroll-area parent-scroll">
      <section className="parent-hero">
        <div>
          <p>家长端</p>
          <h1>{child.name}的学习总览</h1>
          <span>重点看趋势、心态和奖励配置，不做排名和惩罚。</span>
        </div>
        <Trophy size={30} />
      </section>

      <section className="parent-metrics">
        <Metric label="今日可得" value={`${todayPoints}+`} />
        <Metric label="英语连续" value={`${child.englishStreak}天`} />
        <Metric label="数学连续" value={`${child.mathStreak}天`} />
        <Metric label="练字评分" value={`${child.writingScore}`} />
      </section>

      <section className="parent-section">
        <SectionTitle icon={ListChecks} title="四个方向进展" />
        <Progress label="练字稳定度" value="82%" />
        <Progress label="英语完整学习" value="68%" />
        <Progress label="数学概念掌握" value="74%" />
        <Progress label="主动表达" value="56%" />
      </section>

      <section className="parent-section">
        <SectionTitle icon={NotebookPen} title="日记与心态" />
        <div className="insight-line">
          <Sparkles size={17} />
          <p>最近表达里多次提到“想慢一点写好”，属于学习策略意识增强。今天尚未主动记录，可只做轻提醒。</p>
        </div>
        <div className="risk-note parent">
          <ShieldAlert size={16} />
          <span>强风险内容会在这里提醒家长关注；普通低落只进入趋势摘要。</span>
        </div>
      </section>

      <section className="parent-section">
        <SectionTitle icon={Gift} title="奖励配置" />
        <div className="reward-config">
          <div>
            <span>当前目标</span>
            <strong>4200积分 · 周末科学馆</strong>
          </div>
          <button>编辑</button>
        </div>
        <p className="config-note">平台奖励放到 P2，P0 只记录家庭承诺、兑换门槛和完成状态。</p>
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="section-title">
      <Icon size={17} />
      <strong>{title}</strong>
    </div>
  );
}

function Step({ done, title, detail }) {
  return (
    <div className={`step ${done ? "done" : ""}`}>
      <span>{done ? <Check size={14} /> : <ChevronRight size={14} />}</span>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function StreakRow({ label, value }) {
  return (
    <div className="streak-row">
      <span>{label}</span>
      <strong>第 {value} 天完成，额外 +{value} 分</strong>
    </div>
  );
}

function Progress({ label, value }) {
  return (
    <div className="progress-row">
      <span>{label}</span>
      <ProgressBar value={value} />
      <strong>{value}</strong>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <i style={{ width: value }} />
    </div>
  );
}

const container = document.getElementById("root");
window.__nativeLearnRoot ||= createRoot(container);
window.__nativeLearnRoot.render(<App />);

function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
  });
}

registerServiceWorker();
