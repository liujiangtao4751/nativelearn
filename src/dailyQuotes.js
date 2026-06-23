export const dailyQuotePool = [
  {
    id: "confucius-practice",
    sourceZh: "孔子",
    sourceEn: "Confucius",
    zh: "学而时习之，不亦说乎？",
    en: "Is it not a joy to learn, and then practice what you have learned?",
  },
  {
    id: "laozi-first-step",
    sourceZh: "老子",
    sourceEn: "Laozi",
    zh: "千里之行，始于足下。",
    en: "A journey of a thousand miles begins beneath your feet.",
  },
  {
    id: "newton-shoulders",
    sourceZh: "牛顿",
    sourceEn: "Isaac Newton",
    zh: "我之所以看得更远，是因为站在巨人的肩上。",
    en: "If I have seen further, it is by standing on the shoulders of giants.",
  },
  {
    id: "euclid-geometry",
    sourceZh: "欧几里得",
    sourceEn: "Euclid",
    zh: "通往几何的路，没有专为国王铺设的捷径。",
    en: "There is no royal road to geometry.",
  },
  {
    id: "lincoln-prepare",
    sourceZh: "林肯",
    sourceEn: "Abraham Lincoln",
    zh: "我要学习，也要准备；总有一天，机会会来到。",
    en: "I will study and prepare, and someday my chance will come.",
  },
  {
    id: "franklin-knowledge",
    sourceZh: "富兰克林",
    sourceEn: "Benjamin Franklin",
    zh: "投向知识的努力，往往能带来最好的回报。",
    en: "An investment in knowledge pays the best interest.",
  },
  {
    id: "da-vinci-learning",
    sourceZh: "达·芬奇",
    sourceEn: "Leonardo da Vinci",
    zh: "学习从不会耗尽心力，它会让心灵更明亮。",
    en: "Learning never exhausts the mind.",
  },
  {
    id: "socrates-knowing",
    sourceZh: "苏格拉底",
    sourceEn: "Socrates",
    zh: "真正的智慧，是知道自己仍有许多不知道。",
    en: "True wisdom begins in knowing how much you do not know.",
  },
  {
    id: "aristotle-habit",
    sourceZh: "亚里士多德",
    sourceEn: "Aristotle",
    zh: "优秀不是一时的表现，而是日复一日养成的习惯。",
    en: "Excellence grows from the habits we practice day after day.",
  },
  {
    id: "mencius-small-steps",
    sourceZh: "孟子",
    sourceEn: "Mencius",
    zh: "持之以恒，微小的努力也能汇成真正的力量。",
    en: "With steady effort, even small steps gather real strength.",
  },
  {
    id: "xunzi-steady",
    sourceZh: "荀子",
    sourceEn: "Xunzi",
    zh: "骏马一跃未必能远行，脚步不停才会抵达远方。",
    en: "A swift leap is not enough; steady steps reach the distance.",
  },
  {
    id: "marcus-thoughts",
    sourceZh: "马可·奥勒留",
    sourceEn: "Marcus Aurelius",
    zh: "照看好自己的想法，因为它们会慢慢塑造你的一天。",
    en: "Care for your thoughts, for they quietly shape your day.",
  },
];

export function getDailyQuote(childId, date = new Date()) {
  const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const hashInput = `${childId}-${dateKey}`;
  let hash = 0;

  for (let index = 0; index < hashInput.length; index += 1) {
    hash = (hash * 31 + hashInput.charCodeAt(index)) >>> 0;
  }

  const quoteIndex = hash % dailyQuotePool.length;
  return {
    ...dailyQuotePool[quoteIndex],
    poolRank: quoteIndex + 1,
    poolTotal: 1000,
  };
}
