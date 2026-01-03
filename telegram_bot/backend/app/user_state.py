from enum import Enum

class UserState(str, Enum):
    NEW = "NEW"
    NDA_PENDING = "NDA_PENDING"
    NDA_ACCEPTED = "NDA_ACCEPTED"
    ONBOARDING = "ONBOARDING"
    TEST = "TEST"
    AI_CHAT = "AI_CHAT"


# vaqtinchalik (keyin DB bo‘ladi)
USER_STATES = {}
