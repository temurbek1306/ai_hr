from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler
from handlers.start import start
from handlers.callback import handle_callback
from config import BOT_TOKEN


def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(handle_callback))  # 👈 MUHIM

    app.run_polling()


if __name__ == "__main__":
    main()
