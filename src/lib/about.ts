// Owner-editable details. Empty values use the brief fallback and never show placeholders.
export const aboutProfile = {
  name: "Jake", // 你的名字或对外昵称。
  background: "", // 从开发走向交易的个人转折，保持自述语气。
  marketExperience: "", // 对市场的热情与观察，不必写成履历。
  motivation: "", // 做 Bitpunk 的个人原因。
  personalDetail: "", // 一个真实的生活细节、兴趣或习惯；写成一句自然的话。
};

export const aboutContent = {
  introduction: `${aboutProfile.name ? `I’m ${aboutProfile.name}.` : "I’m the person behind Bitpunk."} ${aboutProfile.background || "I made the leap from software development into trading and market analysis. A bold move—but I’ve never felt more like myself."}`,
  paragraphs: [
    aboutProfile.marketExperience || "I’m drawn to crypto and US equities—the conviction, the fear, the moment a market changes its mind. I can lose hours in a chart, following the clues and testing my read.",
    `${aboutProfile.motivation || "Bitpunk is where I put that energy—into research, tools, and ideas I can’t leave alone. This is the work I keep coming back to."}${aboutProfile.personalDetail ? ` ${aboutProfile.personalDetail}` : ""}`,
  ],
};
