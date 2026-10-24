// Owner-editable details. Empty values use the brief fallback and never show placeholders.
export const aboutProfile = {
  name: "Jake", // 你的名字或对外昵称。
  marketExperience: "", // 对市场的热情与观察，不必写成履历。
  motivation: "", // 做 Bitpunk 的个人原因。
  personalDetail: "", // 一个真实的生活细节、兴趣或习惯；写成一句自然的话。
};

export const aboutContent = {
  introduction: aboutProfile.name ? `Hi, I’m ${aboutProfile.name}, the person behind Bitpunk — a small corner of the internet for big questions and better bets.` : "Hi, meet the person behind Bitpunk — a small corner of the internet for big questions and better bets.",
  paragraphs: [
    aboutProfile.marketExperience || "I’m curious about markets, the forces shaping them, and what we can learn by digging a little deeper. I trade, research, and build things along the way.",
    "Not every idea holds up. Not every effort pays off. Markets have a funny way of keeping you humble. The aim isn’t to predict every move, but to make better decisions, understand the risks, and stay open to changing the mind.",
  ],
  signoff: `${aboutProfile.motivation || "Stay wired. Something’s always brewing."}${aboutProfile.personalDetail ? ` ${aboutProfile.personalDetail}` : ""}`,
};
