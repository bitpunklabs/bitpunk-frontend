// Owner-editable details. Empty values use the brief fallback and never show placeholders.
export const aboutProfile = {
  name: "Jake", // 你的名字或对外昵称。
  marketExperience: "", // 对市场的热情与观察，不必写成履历。
  motivation: "", // 做 Bitpunk 的个人原因。
  personalDetail: "", // 一个真实的生活细节、兴趣或习惯；写成一句自然的话。
};

export const aboutContent = {
  introduction: aboutProfile.name ? `Hi, I’m ${aboutProfile.name}, the person behind Bitpunk.` : "Hi, meet the person behind Bitpunk.",
  paragraphs: [
    aboutProfile.marketExperience || "I study crypto and US equities, following questions from the chart into research and code.",
    "Bitpunk brings that work together: market notes, indicators and open-source tools for exploring how markets behave. It’s a place to develop an idea, put it to the test, and make something useful from what I learn.",
  ],
  signoff: `${aboutProfile.motivation || "Sniff around and be patient, there is something cooking."}${aboutProfile.personalDetail ? ` ${aboutProfile.personalDetail}` : ""}`,
};
