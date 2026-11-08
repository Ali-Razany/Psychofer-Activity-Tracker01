const fs = require('fs');
let code = fs.readFileSync('src/components/OnboardingModal.tsx', 'utf8');

const oldSlide = `{
    id: 5,
    title: "ئامادەیت؟ 🚀",
    description: "ئێستا تۆ بەشێکی گرنگی لەم پڕۆژەیە. با پێکەوە دەست پێبکەین، گۆڕانکاری دروست بکەین و سەرکەوتن تۆمار بکەین!",
    icon: "fluent-emoji:rocket"
  }`;

const newSlides = `{
    id: 5,
    title: "قۆناغی تاقیکاری 🛠️",
    description: "ئەم سیستەمە لە ئێستادا تەنها تاقیکارییە. هەر تێبینییەکت هەیە بۆ بەرەوپێشبردن یان هەر کەموکوڕییەک دەبینیت، تکایە لە 'دیوەخانی گشتی' بۆمان بنووسە بۆ ئەوەی پێکەوە باشتری بکەین.",
    icon: "fluent-emoji:hammer-and-wrench"
  },
  {
    id: 6,
    title: "ئامادەیت؟ 🚀",
    description: "ئێستا تۆ بەشێکی گرنگی لەم پڕۆژەیە. با پێکەوە دەست پێبکەین، گۆڕانکاری دروست بکەین و سەرکەوتن تۆمار بکەین!",
    icon: "fluent-emoji:rocket"
  }`;

code = code.replace(oldSlide, newSlides);
fs.writeFileSync('src/components/OnboardingModal.tsx', code);
