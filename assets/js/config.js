/* 71588.com — site configuration. Edit here; no build step needed. */
window.SITE_CONFIG = {
  siteName: "71588.com",
  interestUrl: "https://web.works/contact",

  /* Google AdSense: paste your publisher ID (e.g. "ca-pub-1234567890123456") to switch
     every .ad-slot from a house ad to a live AdSense unit. Also update /ads.txt. */
  adsenseClient: "",
  adsenseSlots: { banner: "", inArticle: "", sidebar: "" },

  /* Google Analytics 4 (optional), e.g. "G-XXXXXXX" */
  gaId: "",

  /* Form delivery. Messages are routed to the owner inbox via FormSubmit's AJAX endpoint.
     The address is stored encoded (_r) and only assembled at submit time — it never
     appears in page text or HTML. After the first submission, FormSubmit sends a one-time
     activation email; once activated you may paste the random alias it gives you below
     (formAlias) and the encoded address is no longer used at all. */
  formAlias: "",
  _r: [42,40,36,105,43,46,38,42,32,7,118,38,52,44,53,40,48,37,34,48],

  /* Support / donations. PayPal donate links are generated at click time. Optional
     third-party links (leave "" to hide). */
  paypalEnabled: true,
  currency: "USD",
  kofiUrl: "",
  buyMeACoffeeUrl: "",
  stripeLinks: { 8: "", 18: "", 88: "", 168: "", 888: "" },

  /* Social profiles (leave "" to hide) */
  social: { youtube: "", x: "", facebook: "", instagram: "", tiktok: "", linkedin: "", weibo: "", xiaohongshu: "" },

  /* YouTube channel videos. Add your own IDs; the first 4 are verified public explainers. */
  videos: [
    { id: "pT52hREAf18", title: "Chinese Lucky Numbers", channel: "Numberphile", topic: "Meanings" },
    { id: "wf13M4MoHS4", title: "Chinese Lucky and Unlucky Numbers Explained", channel: "Learn Chinese Now", topic: "Meanings" },
    { id: "sr673iAqLZY", title: "Meanings behind Chinese Numbers", channel: "Chinese with Christine", topic: "Language" },
    { id: "kRgmrGHeJIc", title: "Why 8 is the luckiest number in Chinese culture", channel: "ABC7 News Bay Area", topic: "Culture" }
  ],

  /* Current contest (dates in ISO). */
  contest: {
    title: "Lucky 88 Challenge",
    deadline: "2027-02-06T23:59:00",
    prize: "US$888 prize pool + Featured Creator badge"
  },

  /* Fundraising goal shown on /support */
  fundGoal: 8888, fundRaised: 0
};
