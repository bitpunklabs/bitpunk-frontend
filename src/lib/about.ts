// Owner-editable details. Empty values use the brief fallback and never show placeholders.
export const aboutProfile = {
  name: "Jake", // 你的名字或对外昵称。
  marketExperience: "", // 对市场的热情与观察，不必写成履历。
  motivation: "", // 做 Bitpunk 的个人原因。
  personalDetail: "", // 一个真实的生活细节、兴趣或习惯；写成一句自然的话。
};

export const aboutContent = {
  introduction: aboutProfile.name ? `Hi, this is ${aboutProfile.name}.` : "Hi, meet the person behind Bitpunk.",
  paragraphs: [
    aboutProfile.marketExperience || "I spend most of my time in crypto and US equities—studying price action and putting ideas to the test.",
  ],
  signoff: `${aboutProfile.motivation || "Stay close and be patient—let’s cook something big."}${aboutProfile.personalDetail ? ` ${aboutProfile.personalDetail}` : ""}`,
};
