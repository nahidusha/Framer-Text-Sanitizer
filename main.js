
let forbiddenWords = [
  "contact","skype","zoom","whatsapp","email","messenger",
  "outside of fiverr","work in other places besides fiverr",
  "pay","payment","paypal","payoneer","bank account",
  "money","credit card","credit card details","transferwise",
  "peopleperhour","upwork","freelancer.com",
  "positive rating","five star","negative feedback","feedback","link"
];

let isBangla = false;
let originalSanitizedText = "";
let originalInputText = "";

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const forbiddenList = document.getElementById("forbiddenList");
const toggleBtn = document.getElementById("toggleLang");
const copyBtn = document.getElementById("copyBtn");

function renderForbiddenWords() {
  forbiddenList.innerHTML = "";
  forbiddenWords.forEach(word => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = word;
    forbiddenList.appendChild(span);
  });
}
renderForbiddenWords();

function sanitizeWord(word) {
  return word.split("").join("-");
}

function sanitizeText(text) {
  let result = text;
  forbiddenWords.forEach(word => {
    const safe = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safe, "gi");
    result = result.replace(regex, m => sanitizeWord(m));
  });
  return result;
}

inputText.addEventListener("input", () => {
  originalInputText = inputText.value;
  originalSanitizedText = sanitizeText(originalInputText);
  outputText.textContent = originalSanitizedText;
  resetLanguage();
});

function copyText() {
  navigator.clipboard.writeText(outputText.textContent);
  copyBtn.textContent = "✔ Copied";
  setTimeout(() => copyBtn.textContent = "📋 Copy", 1200);
}

function addForbiddenWord() {
  const val = document.getElementById("newWord").value.trim();
  if (!val) return;
  forbiddenWords.push(val.toLowerCase());
  document.getElementById("newWord").value = "";
  renderForbiddenWords();
  originalSanitizedText = sanitizeText(originalInputText);
  outputText.textContent = originalSanitizedText;
  resetLanguage();
}

function resetLanguage() {
  isBangla = false;
  toggleBtn.textContent = "Bengali";
}

async function toggleTranslate() {
  if (!originalInputText) return;

  if (!isBangla) {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(originalInputText)}`
    );
    const data = await res.json();
    outputText.textContent = data[0].map(i => i[0]).join("");
    toggleBtn.textContent = "English";
    isBangla = true;
  } else {
    outputText.textContent = originalSanitizedText;
    toggleBtn.textContent = "Bengali";
    isBangla = false;
  }
}