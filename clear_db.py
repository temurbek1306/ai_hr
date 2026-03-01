import sqlite3
import os

db_path = 'backend/database.sqlite'

if not os.path.exists(db_path):
    print(f"Error: Database not found at {db_path}")
    exit(1)

tables = [
    'employee', 'test', 'question', 'option', 
    'test_result', 'onboarding_material', 'notification', 
    'calendar_event', 'reminder', 'knowledge_article', 
    'assignment', 'survey_trigger'
]

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check existing tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    existing_tables = [r[0] for r in cursor.fetchall()]
    
    for table in tables:
        if table in existing_tables:
            cursor.execute(f"DELETE FROM {table}")
            try:
                cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table}'")
            except sqlite3.OperationalError:
                pass # Table doesn't use autoincrement or sequence table not created yet
            print(f"Cleared table: {table}")
        else:
            print(f"Skipping (not found): {table}")
            
    # Keep admin user
    if 'user' in existing_tables:
        cursor.execute("DELETE FROM user WHERE username != 'admin'")
        print("Cleared users (except admin)")

    conn.commit()
    conn.close()
    print("Database cleared successfully.")
except Exception as e:
    print(f"Error: {e}")
    exit(1)
