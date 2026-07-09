const SAVE_KEY = "straying_html_save_v1";

const els = {
  stage: document.getElementById("stage"),
  figure: document.getElementById("figure"),
  titleScreen: document.getElementById("titleScreen"),
  startButton: document.getElementById("startButton"),
  continueButton: document.getElementById("continueButton"),
  hud: document.getElementById("hud"),
  saveButton: document.getElementById("saveButton"),
  loadButton: document.getElementById("loadButton"),
  titleButton: document.getElementById("titleButton"),
  dialogue: document.getElementById("dialogue"),
  speakerName: document.getElementById("speakerName"),
  textButton: document.getElementById("textButton"),
  lineText: document.getElementById("lineText"),
  choices: document.getElementById("choices"),
  nameForm: document.getElementById("nameForm"),
  nameLabel: document.getElementById("nameLabel"),
  nameInput: document.getElementById("nameInput"),
  nameSubmit: document.getElementById("nameSubmit"),
  toast: document.getElementById("toast"),
};

const uiText = {
  ja: {
    start: "はじめから",
    continue: "つづきから",
    save: "保存",
    load: "読込",
    title: "タイトル",
    saved: "保存しました",
    loaded: "読み込みました",
    noSave: "保存データがありません",
    nameLabel: "呼ばれたい名前",
    nameSubmit: "決定",
    nameRequired: "名前を入力してください",
    nameFallback: "あなた",
  },
  en: {
    start: "START",
    continue: "CONTINUE",
    save: "SAVE",
    load: "LOAD",
    title: "TITLE",
    saved: "Saved",
    loaded: "Loaded",
    noSave: "No save data",
    nameLabel: "Name",
    nameSubmit: "OK",
    nameRequired: "Please enter a name",
    nameFallback: "You",
  },
};

const memoryOptions = [
  {
    key: "person",
    label: { ja: "大切な人", en: "Someone" },
    first: {
      ja: "なくしたくない人の顔を思い浮かべる。声、癖、何気ない日々。説明しようとすると、胸の奥が少し熱くなる。",
      en: "You picture a person you do not want to lose. Their voice, their habits, the ordinary days. Trying to explain them warms something deep inside.",
    },
  },
  {
    key: "gift",
    label: { ja: "贈りもの", en: "Gift" },
    first: {
      ja: "誰かが選んでくれたものを思い出す。値段ではなく、そこに込められた時間が、手のひらに残っている気がする。",
      en: "You remember something chosen for you. Not the price, but the time inside it seems to remain in your palm.",
    },
  },
  {
    key: "words",
    label: { ja: "言葉", en: "Words" },
    first: {
      ja: "何度も支えになった言葉を思い出す。誰かの声だったか、本の一行だったか。忘れたくない輪郭だけは残っている。",
      en: "You remember words that held you up. A voice, maybe. A line from a page, maybe. The shape of them remains.",
    },
  },
  {
    key: "treasure",
    label: { ja: "宝物", en: "Treasure" },
    first: {
      ja: "ほかの人にはただのものでも、自分には宝物だった。理由を探しているうちに、その小さな重さを思い出す。",
      en: "It might look ordinary to someone else, but to you it was treasure. While searching for why, you remember its small weight.",
    },
  },
  {
    key: "goal",
    label: { ja: "目標", en: "Goal" },
    first: {
      ja: "まだ叶っていない目標を思い浮かべる。遠くても、頼りなくても、それがあるから前を向けた日があった。",
      en: "You picture a goal not yet reached. Distant and uncertain, but there were days it helped you face forward.",
    },
  },
  {
    key: "place",
    label: { ja: "思い出の場所", en: "Place" },
    first: {
      ja: "戻りたい場所を思い浮かべる。光の入り方、床の音、そこにいた人。部屋の空気が少しだけ近づく。",
      en: "You picture a place you want to return to. The light, the sound of the floor, the people there. The room moves a little closer to it.",
    },
  },
];

const story = {
  introSound: {
    type: "line",
    room: "void",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "どこか遠くで、細い泣き声がしている。",
      en: "Somewhere far away, a thin crying voice is trembling.",
    },
    next: "introSound2",
  },
  introSound2: {
    type: "line",
    room: "void",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "猫の声だと思った。けれど、耳を澄ますほど、それは子どもの声に近づいていく。",
      en: "You think it is a cat at first. The closer you listen, the more it becomes the voice of a child.",
    },
    next: "eyesChoice",
  },
  eyesChoice: {
    type: "choice",
    room: "void",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "まぶたが重い。目を開ければ、何かが変わってしまう気がする。",
      en: "Your eyelids feel heavy. If you open them, something may change.",
    },
    choices: [
      { label: { ja: "目を開ける", en: "Open your eyes" }, next: "wakeRoom" },
      { label: { ja: "まだ開けない", en: "Keep them closed" }, next: "keepClosed" },
    ],
  },
  keepClosed: {
    type: "line",
    room: "void",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "暗闇の中で待ってみる。泣き声だけが、少しずつ近くなる。",
      en: "You wait inside the dark. Only the crying voice comes closer.",
    },
    next: "eyesChoiceAgain",
  },
  eyesChoiceAgain: {
    type: "choice",
    room: "void",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "このままでは、声の主を置いていくことになる。",
      en: "If you stay like this, you will leave the owner of the voice behind.",
    },
    choices: [
      { label: { ja: "目を開ける", en: "Open your eyes" }, next: "wakeRoom" },
    ],
  },
  wakeRoom: {
    type: "line",
    room: "dim",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "目を開けると、そこは窓も明かりもない部屋だった。学校の教室より少し狭いくらいで、家具も見当たらない。",
      en: "You open your eyes in a room with no windows and no lights. It is smaller than a classroom, and there is no furniture.",
    },
    next: "seeChild",
  },
  seeChild: {
    type: "line",
    room: "dim",
    figure: "child",
    speaker: "",
    text: {
      ja: "部屋の隅に、小さな影が膝を抱えている。肩が震えるたび、泣き声が床に落ちる。",
      en: "In the corner, a small shadow is hugging its knees. Every time its shoulders tremble, another sob falls to the floor.",
    },
    next: "callChoice",
  },
  callChoice: {
    type: "choice",
    room: "dim",
    figure: "child",
    speaker: "",
    text: {
      ja: "声をかけるべきか迷う。自分だって、ここがどこなのか分からない。",
      en: "You hesitate to speak. You do not know where this place is either.",
    },
    choices: [
      { label: { ja: "声をかける", en: "Call out" }, next: "callChild" },
      { label: { ja: "少し待つ", en: "Wait a moment" }, next: "waitChild" },
    ],
  },
  waitChild: {
    type: "line",
    room: "dim",
    figure: "child",
    speaker: "",
    text: {
      ja: "待ってみても、泣き声は止まらない。胸の奥に、同じ形の不安が沈んでいく。",
      en: "Waiting does not stop the crying. A similar worry sinks inside your chest.",
    },
    next: "callChild",
  },
  callChild: {
    type: "line",
    room: "dim",
    figure: "child",
    speaker: stateName,
    text: {
      ja: "大丈夫？",
      en: "Are you okay?",
    },
    next: "childLost",
  },
  childLost: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "……なくしちゃった。",
      en: "I lost it...",
    },
    next: "lostWhat",
  },
  lostWhat: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: stateName,
    text: {
      ja: "何をなくしたの？",
      en: "What did you lose?",
    },
    next: "childDoesntKnow",
  },
  childDoesntKnow: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "わかんない。でも、なくなったのは分かる。だから、こわい。",
      en: "I don't know. But I know it is gone. That is why I am scared.",
    },
    next: "roomLook",
  },
  roomLook: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: "",
    text: {
      ja: "見回しても出口はない。誰かの気配もない。ここにいるのは、自分とこの子だけに見えた。",
      en: "You look around, but there is no exit and no sign of anyone else. It seems only you and the child are here.",
    },
    next: "helpChoice",
  },
  helpChoice: {
    type: "choice",
    room: "dim",
    figure: "childWarm",
    speaker: "",
    text: {
      ja: "泣き顔を見ていると、自分の不安より先に、この子を助けたいと思った。",
      en: "Looking at the crying face, you want to help the child before worrying about yourself.",
    },
    choices: [
      { label: { ja: "一緒に探そう", en: "Let's search together" }, next: "searchTogether" },
      { label: { ja: "何ができる？", en: "What can I do?" }, next: "askHelp" },
    ],
  },
  askHelp: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "……一緒に、探してほしい。",
      en: "I want you to search with me.",
    },
    next: "searchTogether",
  },
  searchTogether: {
    type: "line",
    room: "dim",
    figure: "childWalking",
    speaker: stateName,
    text: {
      ja: "うん。一緒に探そう。",
      en: "Okay. Let's search together.",
    },
    next: "handChoice",
  },
  handChoice: {
    type: "choice",
    room: "dim",
    figure: "childWalking",
    speaker: "",
    text: {
      ja: "子どもは少しだけ笑って、小さな手でこちらの指を握った。",
      en: "The child smiles a little and takes your finger with a small hand.",
    },
    choices: [
      { label: { ja: "握り返す", en: "Hold back" }, next: "nameAsk" },
      { label: { ja: "そのままにする", en: "Let it stay" }, next: "nameAsk" },
    ],
  },
  nameAsk: {
    type: "line",
    room: "dim",
    figure: "childWalking",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "ねえ。なんて呼べばいい？",
      en: "Hey. What should I call you?",
    },
    next: "nameInput",
  },
  nameInput: {
    type: "name",
    room: "dim",
    figure: "childWalking",
    speaker: "",
    text: {
      ja: "呼ばれたい名前を入力してください。",
      en: "Enter the name you want to be called.",
    },
  },
  nameConfirm: {
    type: "choice",
    room: "dim",
    figure: "childWalking",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "{name}さん、でいい？",
      en: "Can I call you {name}?",
    },
    choices: [
      { label: { ja: "それでいい", en: "Yes" }, next: "afterName" },
      { label: { ja: "変える", en: "Change it" }, next: "nameInput" },
    ],
  },
  afterName: {
    type: "line",
    room: "dim",
    figure: "childWalking",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "よろしくね、{name}さん。",
      en: "Nice to meet you, {name}.",
    },
    next: "exitQuestion",
  },
  exitQuestion: {
    type: "choice",
    room: "dim",
    figure: "childWalking",
    speaker: "",
    text: {
      ja: "なくしたものを探すには、まずこの部屋を調べるしかない。",
      en: "To search for the lost thing, you have to inspect this room first.",
    },
    choices: [
      { label: { ja: "出口を探す", en: "Search for an exit" }, next: "walkRoom" },
      { label: { ja: "部屋を歩く", en: "Walk around" }, next: "walkRoom" },
    ],
  },
  walkRoom: {
    type: "line",
    room: "dim",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "二人で壁沿いを歩いた。扉も、窓も、照明のスイッチもない。部屋は外側を忘れた箱のようだった。",
      en: "You walk along the walls together. No door, no window, no light switch. The room is like a box that forgot the outside.",
    },
    next: "discouraged",
  },
  discouraged: {
    type: "line",
    room: "dim",
    figure: "child",
    speaker: "",
    text: {
      ja: "探し物どころか、ここから出られないかもしれない。そう思った瞬間、膝から力が抜けた。",
      en: "You may not even be able to leave, let alone find what was lost. The thought drains strength from your knees.",
    },
    next: "hintAsk",
  },
  hintAsk: {
    type: "choice",
    room: "dim",
    figure: "child",
    speaker: "",
    text: {
      ja: "せめて、探し物の手がかりだけでもほしい。",
      en: "At least you need a clue.",
    },
    choices: [
      { label: { ja: "何か思い出した？", en: "Remember anything?" }, next: "hintAnswer" },
      { label: { ja: "まだ分からない？", en: "Still not sure?" }, next: "hintAnswer" },
    ],
  },
  hintAnswer: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "なくしたくないもの、だった気がする。",
      en: "I think it was something I did not want to lose.",
    },
    next: "firstGuess",
  },
  firstGuess: {
    type: "choice",
    room: "dim",
    figure: "childWarm",
    speaker: "",
    text: {
      ja: "なくしたくないもの。まず思いつくのは、失うと困るものだった。",
      en: "Something you do not want to lose. The first things that come to mind are things you would need.",
    },
    choices: [
      { label: { ja: "お金", en: "Money" }, next: "wrongObjects" },
      { label: { ja: "身分証", en: "ID card" }, next: "wrongObjects" },
      { label: { ja: "スマホ", en: "Phone" }, next: "wrongObjects" },
    ],
  },
  wrongObjects: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "ううん。そういう、代わりを探せるものじゃないと思う。",
      en: "No. I do not think it was something you could replace like that.",
    },
    next: "irreplaceable",
  },
  irreplaceable: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: "",
    text: {
      ja: "代わりがないもの。失えば、同じ形では戻ってこないもの。",
      en: "Something irreplaceable. Something that will not return in the same shape if lost.",
    },
    next: "thinkTogether",
  },
  thinkTogether: {
    type: "choice",
    room: "dim",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "{name}さんの、なくしたくないものは？",
      en: "What do you not want to lose, {name}?",
    },
    choices: [
      { label: { ja: "一緒に考える", en: "Think together" }, next: "memoryHub" },
      { label: { ja: "まだ分からない", en: "I do not know yet" }, next: "memoryNudge" },
    ],
  },
  memoryNudge: {
    type: "line",
    room: "dim",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "分からないなら、思いつくところからでいいよ。声に出さなくても、思い浮かべるだけでいい。",
      en: "If you do not know, start anywhere. You do not have to say it aloud. Just picture it.",
    },
    next: "memoryHub",
  },
  memoryHub: {
    type: "memoryHub",
  },
  memoryReflect: {
    type: "memoryReflect",
  },
  memoryThanks: {
    type: "line",
    room: dynamicMemoryRoom,
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "教えてくれてありがとう。……今、部屋が少し明るくなった気がする。",
      en: "Thank you for telling me. I think the room just became a little brighter.",
    },
    next: "memoryHub",
  },
  afterMemories: {
    type: "line",
    room: "bright",
    figure: "childWarm",
    speaker: "",
    text: {
      ja: "自分のなくしたくないものを思い浮かべるたび、空っぽだった部屋に色が戻っていった。",
      en: "Each time you pictured something you did not want to lose, color returned to the empty room.",
    },
    next: "roomLikeChoice",
  },
  roomLikeChoice: {
    type: "choice",
    room: "bright",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "ここ、好き。{name}さんも、ここが好き？",
      en: "I like this place. Do you like it too, {name}?",
    },
    choices: [
      { label: { ja: "好き", en: "I do" }, next: "childFound" },
      { label: { ja: "悪くない", en: "Not bad" }, next: "childFound" },
      { label: { ja: "もっと好きになりたい", en: "I want to like it more" }, next: "childFound" },
    ],
  },
  childFound: {
    type: "line",
    room: "bright",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "なくしたと思っていたもの、見つかったよ。全部、ここにあった。",
      en: "I found what I thought I had lost. It was all here.",
    },
    next: "madeRoom",
  },
  madeRoom: {
    type: "line",
    room: "bright",
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
    text: {
      ja: "ここを作ってくれてありがとう。{name}さんが、なくしたくないものを思い出してくれたから。",
      en: "Thank you for making this place. You remembered what you did not want to lose.",
    },
    next: "wind",
  },
  wind: {
    type: "line",
    room: "bright",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "その瞬間、どこにもなかったはずの風が吹いた。部屋は目を開けていられないほどの光に包まれる。",
      en: "At that moment, a wind blows from nowhere. The room fills with light so bright you can barely keep your eyes open.",
    },
    next: "elderHand",
  },
  elderHand: {
    type: "line",
    room: "elder",
    figure: "elder",
    speaker: "",
    text: {
      ja: "握っていた手の感触が変わる。小さくて温かかった手は、乾いて、骨ばって、少し冷たい手になっていた。",
      en: "The hand you were holding changes. The small warm hand has become dry, bony, and slightly cold.",
    },
    next: "elderVoice1",
  },
  elderVoice1: {
    type: "line",
    room: "elder",
    figure: "elder",
    speaker: { ja: "かすれた声", en: "Faint Voice" },
    text: {
      ja: "その時が来れば、大切なものも、その記憶も、少しずつ遠くなる。",
      en: "When that time comes, important things and the memories of them drift away little by little.",
    },
    next: "elderVoice2",
  },
  elderVoice2: {
    type: "line",
    room: "elder",
    figure: "elder",
    speaker: { ja: "かすれた声", en: "Faint Voice" },
    text: {
      ja: "だから、自分には何も残っていないと思っていた。寂しくて、怖かった。",
      en: "That is why I thought nothing was left in me. I was lonely, and I was afraid.",
    },
    next: "elderVoice3",
  },
  elderVoice3: {
    type: "line",
    room: "elder",
    figure: "elder",
    speaker: { ja: "かすれた声", en: "Faint Voice" },
    text: {
      ja: "でも違った。持っていけなくても、確かに大切だったものがあった。思い出せて、よかった。",
      en: "But I was wrong. Even if I could not carry them with me, there were things that had truly mattered. I am glad I remembered.",
    },
    next: "alone",
  },
  alone: {
    type: "line",
    room: "memory2",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "手の感触が消えた。探しても、もう誰もいない。けれど不思議と分かっていた。最初から、ここにいたのは自分だけだったのだと。",
      en: "The feeling of the hand vanishes. You search, but no one is there. Somehow, you understand. From the beginning, you were the only one here.",
    },
    next: "selfQuestion",
  },
  selfQuestion: {
    type: "choice",
    room: "memory2",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "「ここが好き？」という声が、形を変えて胸の奥に戻ってくる。自分のことが、好き？",
      en: "The question, 'Do you like this place?' returns in another shape. Do you like yourself?",
    },
    choices: [
      { label: { ja: "好き", en: "I do" }, next: "selfAnswerLike", action: () => (state.finalAnswer = "like") },
      { label: { ja: "悪くない", en: "Not bad" }, next: "selfAnswerOkay", action: () => (state.finalAnswer = "okay") },
      { label: { ja: "今より好きになりたい", en: "I want to like myself more" }, next: "selfAnswerMore", action: () => (state.finalAnswer = "more") },
    ],
  },
  selfAnswerLike: {
    type: "line",
    room: "memory2",
    figure: "hidden",
    speaker: stateName,
    text: { ja: "好き、だと思う。少なくとも、そう言えるものを自分の中に見つけた。", en: "I think I do. At least I found something in me that lets me say it." },
    next: "doorAppears",
  },
  selfAnswerOkay: {
    type: "line",
    room: "memory2",
    figure: "hidden",
    speaker: stateName,
    text: { ja: "悪くない、と思う。今はその言葉で十分だ。", en: "Not bad, I think. For now, those words are enough." },
    next: "doorAppears",
  },
  selfAnswerMore: {
    type: "line",
    room: "memory2",
    figure: "hidden",
    speaker: stateName,
    text: { ja: "まだ難しい。けれど、今より好きになりたい。その願いだけは、なくしたくない。", en: "It is still difficult. But I want to like myself more. I do not want to lose that wish." },
    next: "doorAppears",
  },
  doorAppears: {
    type: "line",
    room: "door",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "風がやみ、壁に扉が現れていた。まるで、もう出ていいと言われているみたいだった。",
      en: "The wind stops, and a door has appeared in the wall. It feels as if the room is saying you may leave now.",
    },
    next: "leaveRoom",
  },
  leaveRoom: {
    type: "line",
    room: "door",
    figure: "hidden",
    speaker: "",
    text: {
      ja: "なくしたくないものを抱えて、その部屋を出た。",
      en: "Holding what you did not want to lose, you leave the room.",
    },
    next: "ending",
  },
  ending: {
    type: "ending",
    room: "end",
    figure: "hidden",
  },
};

let state = createInitialState("ja");
let typingTimer = null;
let isTyping = false;
let currentFullText = "";

function createInitialState(lang) {
  return {
    lang,
    node: "introSound",
    playerName: "",
    memories: [],
    lastMemory: "",
    finalAnswer: "",
  };
}

function stateName() {
  return state.playerName || uiText[state.lang].nameFallback;
}

function dynamicMemoryRoom() {
  if (state.memories.length >= 3) return "bright";
  if (state.memories.length === 2) return "memory2";
  if (state.memories.length === 1) return "memory1";
  return "dim";
}

function t(value) {
  if (typeof value === "function") return value();
  if (typeof value === "string") return value;
  return value?.[state.lang] ?? "";
}

function format(text) {
  return String(text).replaceAll("{name}", stateName());
}

function setRoom(roomValue) {
  els.stage.dataset.room = t(roomValue) || "dim";
}

function setFigure(kind) {
  els.figure.className = "figure";
  if (!kind || kind === "hidden") {
    els.figure.classList.add("figure--hidden");
    return;
  }
  if (kind === "childWarm") els.figure.classList.add("figure--warm");
  if (kind === "childWalking") els.figure.classList.add("figure--warm", "figure--walking");
  if (kind === "elder") els.figure.classList.add("figure--elder");
}

function saveState(show = false) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  updateContinueButton();
  if (show) showToast(uiText[state.lang].saved);
}

function readSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadState(show = false) {
  const saved = readSave();
  if (!saved) {
    showToast(uiText[state.lang].noSave);
    return false;
  }
  state = {
    ...createInitialState(saved.lang || state.lang),
    ...saved,
    memories: Array.isArray(saved.memories) ? saved.memories : [],
  };
  if (show) showToast(uiText[state.lang].loaded);
  updateLanguage();
  return true;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 1400);
}

function updateLanguage() {
  const copy = uiText[state.lang];
  document.documentElement.lang = state.lang;
  els.startButton.textContent = copy.start;
  els.continueButton.textContent = copy.continue;
  els.saveButton.textContent = copy.save;
  els.loadButton.textContent = copy.load;
  els.titleButton.textContent = copy.title;
  els.nameLabel.textContent = copy.nameLabel;
  els.nameSubmit.textContent = copy.nameSubmit;
  document.querySelectorAll(".language-switch__button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === state.lang);
  });
  updateContinueButton();
}

function updateContinueButton() {
  els.continueButton.disabled = !readSave();
}

function showTitle() {
  stopTyping();
  els.titleScreen.classList.remove("is-hidden");
  els.dialogue.hidden = true;
  els.hud.hidden = true;
  els.nameForm.hidden = true;
  setRoom("void");
  setFigure("hidden");
  updateLanguage();
}

function startNew() {
  state = createInitialState(state.lang);
  els.titleScreen.classList.add("is-hidden");
  els.dialogue.hidden = false;
  els.hud.hidden = false;
  saveState();
  render();
}

function continueGame() {
  if (!loadState(true)) return;
  els.titleScreen.classList.add("is-hidden");
  els.dialogue.hidden = false;
  els.hud.hidden = false;
  render();
}

function go(nextNode) {
  state.node = typeof nextNode === "function" ? nextNode() : nextNode;
  saveState();
  render();
}

function stopTyping() {
  if (typingTimer) window.clearInterval(typingTimer);
  typingTimer = null;
  isTyping = false;
}

function typeText(text, done) {
  stopTyping();
  currentFullText = text;
  els.lineText.textContent = "";
  isTyping = true;
  let i = 0;
  typingTimer = window.setInterval(() => {
    i += 1;
    els.lineText.textContent = text.slice(0, i);
    if (i >= text.length) {
      stopTyping();
      done?.();
    }
  }, state.lang === "ja" ? 24 : 16);
}

function completeTyping() {
  if (!isTyping) return false;
  stopTyping();
  els.lineText.textContent = currentFullText;
  return true;
}

function renderBase(node) {
  els.dialogue.hidden = false;
  els.nameForm.hidden = true;
  els.choices.innerHTML = "";
  setRoom(node.room || dynamicMemoryRoom);
  setFigure(node.figure || "hidden");
  els.speakerName.textContent = format(t(node.speaker));
}

function render() {
  const node = story[state.node];
  if (!node) {
    state.node = "introSound";
    return render();
  }

  updateLanguage();

  if (node.type === "memoryHub") return renderMemoryHub();
  if (node.type === "memoryReflect") return renderMemoryReflect();
  if (node.type === "ending") return renderEnding();

  renderBase(node);
  const text = format(t(node.text));

  if (node.type === "name") {
    typeText(text, () => {
      els.nameForm.hidden = false;
      els.nameInput.value = state.playerName;
      els.nameInput.focus();
    });
    return;
  }

  if (node.type === "choice") {
    typeText(text, () => renderChoices(node.choices));
    return;
  }

  typeText(text);
}

function renderChoices(choices) {
  els.choices.innerHTML = "";
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    if (choices.length === 1 || format(t(choice.label)).length > 16) {
      button.classList.add("choice-button--wide");
    }
    button.textContent = format(t(choice.label));
    button.addEventListener("click", () => {
      choice.action?.();
      if (choice.next) go(choice.next);
    });
    els.choices.appendChild(button);
  });
}

function renderMemoryHub() {
  if (state.memories.length >= 3) {
    return go("afterMemories");
  }

  const room = dynamicMemoryRoom();
  renderBase({
    room,
    figure: "childWarm",
    speaker: { ja: "子ども", en: "Child" },
  });

  const text = state.memories.length === 0
    ? {
        ja: "{name}さんのなくしたくないもの、思いつくものから教えて。",
        en: "Tell me what you do not want to lose, {name}. Start anywhere.",
      }
    : {
        ja: "他にもある？ 思いつくものを、もう少しだけ。",
        en: "Is there anything else? Just a little more, if you can think of it.",
      };

  typeText(format(t(text)), () => {
    const choices = memoryOptions
      .filter((item) => !state.memories.includes(item.key))
      .map((item) => ({
        label: item.label,
        next: "memoryReflect",
        action: () => {
          state.lastMemory = item.key;
          state.memories.push(item.key);
        },
      }));

    if (state.memories.length > 0) {
      choices.push({
        label: { ja: "もう思いつかない", en: "Nothing else comes to mind" },
        next: "afterMemories",
      });
    }
    renderChoices(choices);
  });
}

function renderMemoryReflect() {
  const item = memoryOptions.find((option) => option.key === state.lastMemory) || memoryOptions[0];
  renderBase({
    room: dynamicMemoryRoom,
    figure: "childWarm",
    speaker: stateName,
  });
  typeText(format(t(item.first)), () => {
    els.choices.innerHTML = "";
  });
}

function renderEnding() {
  renderBase({
    room: "end",
    figure: "hidden",
    speaker: "",
  });
  const memoryLabels = state.memories
    .map((key) => memoryOptions.find((item) => item.key === key))
    .filter(Boolean)
    .map((item) => t(item.label));
  const endingText = state.lang === "ja"
    ? `朝のような光が背中に残っている。${stateName()}は、${memoryLabels.join("、")}を忘れないように、ゆっくり息をした。`
    : `A morning-like light remains at your back. ${stateName()} breathes slowly, holding ${memoryLabels.join(", ")} in memory.`;

  typeText(endingText, () => {
    renderChoices([
      {
        label: { ja: "タイトルへ", en: "Back to title" },
        next: null,
        action: () => {
          state.node = "introSound";
          saveState();
          showTitle();
        },
      },
    ]);
  });
}

els.textButton.addEventListener("click", () => {
  if (completeTyping()) {
    const node = story[state.node];
    if (node?.type === "choice") renderChoices(node.choices);
    if (node?.type === "memoryHub") renderMemoryHub();
    if (node?.type === "name") els.nameForm.hidden = false;
    return;
  }

  const node = story[state.node];
  if (node?.type === "memoryReflect") {
    go("memoryThanks");
    return;
  }
  if (!node || node.type !== "line") return;
  go(node.next);
});

els.nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = els.nameInput.value.trim();
  if (!name) {
    showToast(uiText[state.lang].nameRequired);
    els.nameInput.focus();
    return;
  }
  state.playerName = name.slice(0, 8);
  go("nameConfirm");
});

els.startButton.addEventListener("click", startNew);
els.continueButton.addEventListener("click", continueGame);
els.saveButton.addEventListener("click", () => saveState(true));
els.loadButton.addEventListener("click", () => {
  if (loadState(true)) render();
});
els.titleButton.addEventListener("click", showTitle);

document.querySelectorAll(".language-switch__button").forEach((button) => {
  button.addEventListener("click", () => {
    state.lang = button.dataset.lang;
    updateLanguage();
  });
});

window.addEventListener("keydown", (event) => {
  if (els.titleScreen.classList.contains("is-hidden") && !els.nameForm.hidden) return;
  if (event.key === "Enter" || event.key === " ") {
    if (!els.titleScreen.classList.contains("is-hidden")) return;
    event.preventDefault();
    els.textButton.click();
  }
});

updateLanguage();
showTitle();
