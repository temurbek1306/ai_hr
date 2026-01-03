# from fastapi import FastAPI, Depends
# from pydantic import BaseModel
# from typing import List
# from sqlalchemy.orm import Session
# from app.models import Test, TestQuestion, TestSession
# from app.database import SessionLocal, engine
# from app.models import User


# # ====================
# # APP INIT
# # ====================

# app = FastAPI(title="AI HR Backend MVP")

# User.metadata.create_all(bind=engine)


# # ====================
# # DB DEPENDENCY
# # ====================

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# # ====================
# # SCHEMAS
# # ====================



# class MenuRequest(BaseModel):
#     telegram_id: int


# class ActionRequest(BaseModel):
#     telegram_id: int
#     action: str


# class Button(BaseModel):
#     label: str
#     action: str


# class MenuResponse(BaseModel):
#     text: str
#     buttons: List[Button]

# class TestStartRequest(BaseModel):
#     telegram_id: int


# class TestQuestionResponse(BaseModel):
#     text: str
#     buttons: List[Button]

# class TestAnswerRequest(BaseModel):
#     telegram_id: int
#     answer: str

# # ====================
# # HEALTH CHECK
# # ====================

# @app.get("/")
# def health():
#     return {"status": "ok", "service": "AI HR Backend"}


# # ====================
# # BOT MENU (/start)
# # ====================

# @app.post("/api/v1/bot/menu", response_model=MenuResponse)
# def bot_menu(data: MenuRequest, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.telegram_id == data.telegram_id).first()

#     if not user:
#         user = User(
#             telegram_id=data.telegram_id,
#             nda_accepted=False,
#             onboarding_started=False,
#             onboarding_completed=False
#         )
#         db.add(user)
#         db.commit()

#     # 1️⃣ NDA yo‘q
#     if not user.nda_accepted:
#         return {
#             "text": "📄 Davom etish uchun NDA bilan tanishib rozilik bering.",
#             "buttons": [
#                 {"label": "📄 NDA bilan tanishish", "action": "nda"}
#             ]
#         }

#     # 2️⃣ NDA bor, onboarding boshlanmagan
#     if user.nda_accepted and not user.onboarding_started:
#         return {
#             "text": "✅ NDA qabul qilindi.\n\nOnboardingni boshlang.",
#             "buttons": [
#                 {"label": "📚 Onboardingni boshlash", "action": "onboarding_start"}
#             ]
#         }

#     # 3️⃣ Onboarding davom etmoqda
#     if user.onboarding_started and not user.onboarding_completed:
#         return {
#             "text": "📚 Onboarding davom etmoqda.",
#             "buttons": [
#                 {"label": "📚 Materiallarni ko‘rish", "action": "onboarding_menu"}
#             ]
#         }

#     # 4️⃣ Hammasi tugagan
#     return {
#         "text": "🎉 Xush kelibsiz! Tizimdan foydalanishingiz mumkin.",
#         "buttons": [
#             {"label": "🧪 Test", "action": "test"},
#             {"label": "🤖 AI Chat", "action": "ai_chat"}
#         ]
#     }


# # ====================
# # BOT ACTIONS
# # ====================

# @app.post("/api/v1/bot/action", response_model=MenuResponse)
# def bot_action(data: ActionRequest, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.telegram_id == data.telegram_id).first()

#     if not user:
#         return {
#             "text": "❗ User topilmadi. /start ni qayta bosing.",
#             "buttons": []
#         }

#     action = data.action


#     # -------- NDA --------
#     if action == "nda":
#         return {
#             "text": (
#                 "📄 NDA – Maxfiylik shartnomasi\n\n"
#                 "Bu hujjat kompaniya ma’lumotlarini himoya qiladi."
#             ),
#             "buttons": [
#                 {"label": "✅ Roziman", "action": "nda_accept"},
#                 {"label": "❌ Roziman emas", "action": "nda_reject"}
#             ]
#         }

#     if action == "nda_accept":
#         user.nda_accepted = True
#         db.commit()

#         return {
#             "text": "✅ NDA qabul qilindi.",
#             "buttons": [
#                 {"label": "📚 Onboardingni boshlash", "action": "onboarding_start"}
#             ]
#         }

#     if action == "nda_reject":
#         return {
#             "text": "❌ NDA qabul qilinmadi.\n\nDavom etish mumkin emas.",
#             "buttons": []
#         }


#     # -------- ONBOARDING --------
#     if action == "onboarding_start":
#         user.onboarding_started = True
#         db.commit()

#         return onboarding_menu_response()

#     if action == "onboarding_menu":
#         return onboarding_menu_response()

#     if action == "material_1":
#         return {
#             "text": "📄 Kompaniya haqida ma’lumot.",
#             "buttons": [
#                 {"label": "✅ O‘rganildi", "action": "material_1_done"}
#             ]
#         }

#     if action == "material_1_done":
#         return onboarding_menu_response()

#     if action == "onboarding_complete":
#         user.onboarding_completed = True
#         db.commit()

#         return {
#             "text": "🎉 Onboarding yakunlandi!",
#             "buttons": [
#                 {"label": "🧪 Testni boshlash", "action": "test"}
#             ]
#         }


#     # -------- TEST --------
#     if action == "test":
#         return {
#             "text": "🧪 Test bo‘limi (keyingi bosqichda).",
#             "buttons": []
#         }


#     # -------- AI CHAT --------
#     if action == "ai_chat":
#         return {
#             "text": "🤖 AI Chat (keyingi bosqichda).",
#             "buttons": []
#         }

#     return {
#         "text": "❗ Noma’lum amal.",
#         "buttons": []
#     }


# # ====================
# # ONBOARDING MENU (HELPER)
# # ====================

# def onboarding_menu_response() -> MenuResponse:
#     return {
#         "text": (
#             "📚 Onboarding materiallari\n\n"
#             "Ketma-ket o‘rganing:"
#         ),
#         "buttons": [
#             {"label": "📄 Kompaniya haqida", "action": "material_1"},
#             {"label": "✅ Onboardingni yakunlash", "action": "onboarding_complete"}
#         ]
#     }


# @app.post("/api/v1/tests/start", response_model=TestQuestionResponse)
# def start_test(data: TestStartRequest):
#     db = get_db()

#     # Demo testni topamiz (id=1 deb olaylik)
#     test = db.query(Test).first()
#     if not test:
#         return {
#             "text": "❌ Test topilmadi.",
#             "buttons": []
#         }

#     # Session bor-yo‘qligini tekshiramiz
#     session = (
#         db.query(TestSession)
#         .filter(
#             TestSession.telegram_id == data.telegram_id,
#             TestSession.test_id == test.id,
#             TestSession.completed == False
#         )
#         .first()
#     )

#     if not session:
#         session = TestSession(
#             telegram_id=data.telegram_id,
#             test_id=test.id
#         )
#         db.add(session)
#         db.commit()
#         db.refresh(session)

#     # Savollarni olamiz
#     questions = (
#         db.query(TestQuestion)
#         .filter(TestQuestion.test_id == test.id)
#         .all()
#     )

#     if session.current_question >= len(questions):
#         session.completed = True
#         db.commit()
#         return {
#             "text": "🎉 Test yakunlandi!",
#             "buttons": []
#         }

#     question = questions[session.current_question]

#     return {
#         "text": f"🧪 Savol {session.current_question + 1}:\n\n{question.question}",
#         "buttons": [
#             {"label": "A", "action": "answer_A"},
#             {"label": "B", "action": "answer_B"},
#             {"label": "C", "action": "answer_C"}
#         ]
#     }

# @app.post("/api/v1/tests/answer", response_model=TestQuestionResponse)
# def answer_test(data: TestAnswerRequest):
#     db = get_db()

#     # Faol sessionni topamiz
#     session = (
#         db.query(TestSession)
#         .filter(
#             TestSession.telegram_id == data.telegram_id,
#             TestSession.completed == False
#         )
#         .first()
#     )

#     if not session:
#         return {
#             "text": "❗ Faol test topilmadi. Avval testni boshlang.",
#             "buttons": []
#         }

#     # Savollarni olamiz
#     questions = (
#         db.query(TestQuestion)
#         .filter(TestQuestion.test_id == session.test_id)
#         .all()
#     )

#     if session.current_question >= len(questions):
#         session.completed = True
#         db.commit()
#         return {
#             "text": "🎉 Test allaqachon yakunlangan.",
#             "buttons": []
#         }

#     current_question = questions[session.current_question]

#     # Javobni tekshiramiz
#     if data.answer.upper() == current_question.correct_answer.upper():
#         session.score += 1

#     # Keyingi savolga o‘tamiz
#     session.current_question += 1

#     # Agar savollar tugagan bo‘lsa
#     if session.current_question >= len(questions):
#         session.completed = True
#         db.commit()

#         return {
#             "text": (
#                 f"🎉 Test yakunlandi!\n\n"
#                 f"To‘g‘ri javoblar: {session.score} / {len(questions)}"
#             ),
#             "buttons": [
#                 {"label": "🤖 AI tahlil", "action": "ai_chat"}
#             ]
#         }

#     # Keyingi savol
#     next_question = questions[session.current_question]
#     db.commit()

#     return {
#         "text": f"🧪 Savol {session.current_question + 1}:\n\n{next_question.question}",
#         "buttons": [
#             {"label": "A", "action": "answer_A"},
#             {"label": "B", "action": "answer_B"},
#             {"label": "C", "action": "answer_C"}
#         ]
#     }


from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app.models import User, Test, TestQuestion, TestSession


# ====================
# APP INIT
# ====================

app = FastAPI(title="AI HR Backend MVP")

# Create tables
User.metadata.create_all(bind=engine)
Test.metadata.create_all(bind=engine)
TestQuestion.metadata.create_all(bind=engine)
TestSession.metadata.create_all(bind=engine)


# ====================
# DB DEPENDENCY
# ====================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ====================
# SCHEMAS
# ====================

class MenuRequest(BaseModel):
    telegram_id: int


class ActionRequest(BaseModel):
    telegram_id: int
    action: str


class Button(BaseModel):
    label: str
    action: str


class MenuResponse(BaseModel):
    text: str
    buttons: List[Button]


class TestStartRequest(BaseModel):
    telegram_id: int


class TestAnswerRequest(BaseModel):
    telegram_id: int
    answer: str


class TestQuestionResponse(BaseModel):
    text: str
    buttons: List[Button]


# ====================
# HEALTH CHECK
# ====================

@app.get("/")
def health():
    return {
        "status": "ok",
        "service": "AI HR Backend"
    }


# ====================
# BOT MENU (/start)
# ====================

@app.post("/api/v1/bot/menu", response_model=MenuResponse)
def bot_menu(data: MenuRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.telegram_id == data.telegram_id).first()

    if not user:
        user = User(
            telegram_id=data.telegram_id,
            nda_accepted=False,
            onboarding_started=False,
            onboarding_completed=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # NDA not accepted
    if not user.nda_accepted:
        return {
            "text": "📄 Davom etish uchun NDA bilan tanishib rozilik bering.",
            "buttons": [
                {"label": "📄 NDA bilan tanishish", "action": "nda"}
            ]
        }

    # NDA accepted, onboarding not started
    if user.nda_accepted and not user.onboarding_started:
        return {
            "text": "✅ NDA qabul qilindi.\n\nOnboardingni boshlang.",
            "buttons": [
                {"label": "📚 Onboardingni boshlash", "action": "onboarding_start"}
            ]
        }

    # Onboarding in progress
    if user.onboarding_started and not user.onboarding_completed:
        return {
            "text": "📚 Onboarding davom etmoqda.",
            "buttons": [
                {"label": "📚 Materiallarni ko‘rish", "action": "onboarding_menu"}
            ]
        }

    # Fully onboarded
    return {
        "text": "🎉 Xush kelibsiz! Tizimdan foydalanishingiz mumkin.",
        "buttons": [
            {"label": "🧪 Test", "action": "test"},
            {"label": "🤖 AI Chat", "action": "ai_chat"}
        ]
    }


# ====================
# BOT ACTIONS
# ====================

@app.post("/api/v1/bot/action", response_model=MenuResponse)
def bot_action(data: ActionRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.telegram_id == data.telegram_id).first()

    if not user:
        return {
            "text": "❗ User topilmadi. /start ni qayta bosing.",
            "buttons": []
        }

    action = data.action


    # -------- NDA --------

    if action == "nda":
        return {
            "text": (
                "📄 NDA – Maxfiylik shartnomasi\n\n"
                "Bu hujjat kompaniya ma’lumotlarini himoya qiladi."
            ),
            "buttons": [
                {"label": "✅ Roziman", "action": "nda_accept"},
                {"label": "❌ Roziman emas", "action": "nda_reject"}
            ]
        }

    if action == "nda_accept":
        user.nda_accepted = True
        db.commit()

        return {
            "text": "✅ NDA qabul qilindi.",
            "buttons": [
                {"label": "📚 Onboardingni boshlash", "action": "onboarding_start"}
            ]
        }

    if action == "nda_reject":
        return {
            "text": "❌ NDA qabul qilinmadi.\n\nDavom etish mumkin emas.",
            "buttons": []
        }


    # -------- ONBOARDING --------

    if action == "onboarding_start":
        user.onboarding_started = True
        db.commit()
        return onboarding_menu_response()

    if action == "onboarding_menu":
        return onboarding_menu_response()

    if action == "material_1":
        return {
            "text": "📄 Kompaniya haqida ma’lumot.",
            "buttons": [
                {"label": "✅ O‘rganildi", "action": "material_1_done"}
            ]
        }

    if action == "material_1_done":
        return onboarding_menu_response()

    if action == "onboarding_complete":
        user.onboarding_completed = True
        db.commit()
        return {
            "text": "🎉 Onboarding yakunlandi!",
            "buttons": [
                {"label": "🧪 Testni boshlash", "action": "test"}
            ]
        }


    # -------- TEST --------

    if action == "test":
        return {
            "text": "🧪 Testni boshlash uchun tayyormisiz?",
            "buttons": [
                {"label": "▶️ Boshlash", "action": "start_test"}
            ]
        }


    # -------- AI CHAT --------

    if action == "ai_chat":
        return {
            "text": "🤖 AI Chat (keyingi bosqichda).",
            "buttons": []
        }

    return {
        "text": "❗ Noma’lum amal.",
        "buttons": []
    }


# ====================
# ONBOARDING MENU (HELPER)
# ====================

def onboarding_menu_response() -> MenuResponse:
    return {
        "text": (
            "📚 Onboarding materiallari\n\n"
            "Ketma-ket o‘rganing:"
        ),
        "buttons": [
            {"label": "📄 Kompaniya haqida", "action": "material_1"},
            {"label": "✅ Onboardingni yakunlash", "action": "onboarding_complete"}
        ]
    }


# ====================
# TEST START
# ====================

@app.post("/api/v1/tests/start", response_model=TestQuestionResponse)
def start_test(data: TestStartRequest, db: Session = Depends(get_db)):

    test = db.query(Test).first()
    if not test:
        return {
            "text": "❌ Test topilmadi.",
            "buttons": []
        }

    session = (
        db.query(TestSession)
        .filter(
            TestSession.telegram_id == data.telegram_id,
            TestSession.test_id == test.id,
            TestSession.completed == False
        )
        .first()
    )

    if not session:
        session = TestSession(
            telegram_id=data.telegram_id,
            test_id=test.id,
            current_question=0,
            score=0,
            completed=False
        )
        db.add(session)
        db.commit()
        db.refresh(session)

    questions = (
        db.query(TestQuestion)
        .filter(TestQuestion.test_id == test.id)
        .all()
    )

    if session.current_question >= len(questions):
        session.completed = True
        db.commit()
        return {
            "text": "🎉 Test yakunlandi!",
            "buttons": []
        }

    question = questions[session.current_question]

    return {
        "text": f"🧪 Savol {session.current_question + 1}:\n\n{question.question}",
        "buttons": [
            {"label": "A", "action": "A"},
            {"label": "B", "action": "B"},
            {"label": "C", "action": "C"}
        ]
    }


# ====================
# TEST ANSWER
# ====================

@app.post("/api/v1/tests/answer", response_model=TestQuestionResponse)
def answer_test(data: TestAnswerRequest, db: Session = Depends(get_db)):

    session = (
        db.query(TestSession)
        .filter(
            TestSession.telegram_id == data.telegram_id,
            TestSession.completed == False
        )
        .first()
    )

    if not session:
        return {
            "text": "❗ Faol test topilmadi.",
            "buttons": []
        }

    questions = (
        db.query(TestQuestion)
        .filter(TestQuestion.test_id == session.test_id)
        .all()
    )

    current_question = questions[session.current_question]

    if data.answer.upper() == current_question.correct_answer.upper():
        session.score += 1

    session.current_question += 1

    if session.current_question >= len(questions):
        session.completed = True
        db.commit()
        return {
            "text": (
                f"🎉 Test yakunlandi!\n\n"
                f"To‘g‘ri javoblar: {session.score} / {len(questions)}"
            ),
            "buttons": [
                {"label": "🤖 AI tahlil", "action": "ai_chat"}
            ]
        }

    next_question = questions[session.current_question]
    db.commit()

    return {
        "text": f"🧪 Savol {session.current_question + 1}:\n\n{next_question.question}",
        "buttons": [
            {"label": "A", "action": "A"},
            {"label": "B", "action": "B"},
            {"label": "C", "action": "C"}
        ]
    }
