from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from api import post


async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    telegram_id = query.from_user.id
    action = query.data  # << MUHIM

    data = post(
        "/api/v1/bot/action",
        {
            "telegram_id": telegram_id,
            "action": action
        }
    )

    text = data.get("text", "")
    buttons = data.get("buttons", [])

    keyboard = [
        [InlineKeyboardButton(b["label"], callback_data=b["action"])]
        for b in buttons
    ]

    await query.message.edit_text(
        text=text,
        reply_markup=InlineKeyboardMarkup(keyboard) if keyboard else None
    )
