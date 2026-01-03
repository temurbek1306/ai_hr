from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    CallbackQueryHandler
)

from config import BOT_TOKEN
from handlers.start import start
from handlers.callbacks import handle_callback

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(handle_callback))

    print("🤖 Telegram bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
