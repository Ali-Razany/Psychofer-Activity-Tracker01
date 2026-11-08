async function run() {
  const mod = await import('node-telegram-bot-api');
  const TelegramBot = mod.default || mod;
  console.log(typeof TelegramBot);
}
run();
