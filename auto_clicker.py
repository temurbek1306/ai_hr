import pyautogui
import time

# Antigravity "Run Alt+Enter" tugmasini avtomatik bosuvchi dastur
def auto_clicker():
    print("Avtomatik bosuvchi ishga tushdi...")
    print("To'xtatish uchun: Ctrl+C yoki sichqonchani ekranning yuqori-chap burchagiga olib boring.")
    
    try:
        while True:
            # Alt+Enter shortcut'ini yuborish
            pyautogui.hotkey('alt', 'enter')
            
            # 2 soniya kutish (vaqtni o'zgartirishingiz mumkin)
            time.sleep(2) 
            
    except KeyboardInterrupt:
        print("\nDastur to'xtatildi.")

if __name__ == "__main__":
    auto_clicker()