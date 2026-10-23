// Owner-editable details. Empty values use the brief fallback and never show placeholders.
export const aboutProfile = {
  name: "Jake", // 你的名字或对外昵称。
  background: "", // 从开发走向交易的个人转折，保持自述语气。
  marketExperience: "", // 对市场的热情与观察，不必写成履历。
  motivation: "", // 做 Bitpunk 的个人原因。
  personalDetail: "", // 一个真实的生活细节、兴趣或习惯；写成一句自然的话。
};

export const aboutContent = {
  introduction: aboutProfile.name ? `This is ${aboutProfile.name}.` : "The person behind Bitpunk.",
  paragraphs: [
    aboutProfile.background || "Software developer turned trader and market analyst. A bold move—but I’ve never felt more like myself.",
    aboutProfile.marketExperience || "Crypto. US equities. I live for figuring out what moves them.",
  ],
  signoff: `${aboutProfile.motivation || "I’m always cooking something big."}${aboutProfile.personalDetail ? ` ${aboutProfile.personalDetail}` : ""}`,
  invitation: "Stay close.",
};
