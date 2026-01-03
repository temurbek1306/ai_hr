from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from api import post

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    telegram_id = update.effective_user.id

    data = post(
        "/api/v1/bot/menu",
        {"telegram_id": telegram_id}
    )

    text = data.get("text", "Xatolik")
    buttons = data.get("buttons", [])

    keyboard = [
        [InlineKeyboardButton(b["label"], callback_data=b["action"])]
        for b in buttons
    ]

    await update.message.reply_text(
        text,
        reply_markup=InlineKeyboardMarkup(keyboard) if keyboard else None
    )
