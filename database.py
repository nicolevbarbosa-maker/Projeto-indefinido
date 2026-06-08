import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost", port=3307, user="root", password="", database="agrovision"
    )

def buscar_praga_no_banco():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT praga_nome FROM historico ORDER BY id DESC LIMIT 1")
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()
    return resultado["praga_nome"] if resultado else "Nenhuma praga detectada"