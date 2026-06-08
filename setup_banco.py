import mysql.connector

# Conectando na porta 3307 que você configurou
conn = mysql.connector.connect(
    host="localhost",
    port=3307,
    user="root",
    password=""
)
cursor = conn.cursor()

# Comandos DDL
cursor.execute("CREATE DATABASE IF NOT EXISTS agrovision")
cursor.execute("USE agrovision")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS historico (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        setor VARCHAR(50),
        praga_nome VARCHAR(100),
        confianca FLOAT,
        status VARCHAR(20)
    )
""")

print("Banco e Tabela criados com sucesso!")
cursor.close()
conn.close()