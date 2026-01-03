from sqlalchemy import Column, Integer, Boolean, BigInteger, String, ForeignKey
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(BigInteger, unique=True, index=True)

    nda_accepted = Column(Boolean, default=False)
    onboarding_started = Column(Boolean, default=False)
    onboarding_completed = Column(Boolean, default=False)


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)

class TestQuestion(Base):
    __tablename__ = "test_questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"))

    question = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)

class TestSession(Base):
    __tablename__ = "test_sessions"

    id = Column(Integer, primary_key=True, index=True)

    telegram_id = Column(BigInteger, index=True)
    test_id = Column(Integer)

    current_question = Column(Integer, default=0)
    score = Column(Integer, default=0)
    completed = Column(Boolean, default=False)