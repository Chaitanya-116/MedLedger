import sqlite3

conn = sqlite3.connect("medledger.db")
cursor = conn.cursor()

tables = cursor.execute(
    "SELECT name FROM sqlite_master WHERE type='table';"
).fetchall()

print("Tables:")
for table in tables:
    print(table[0])

print("\nMedicines:")
rows = cursor.execute("SELECT * FROM medicines").fetchall()

for row in rows:
    print(row)

conn.close()