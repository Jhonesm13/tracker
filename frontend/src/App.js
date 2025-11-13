import React, { useState } from "react";

function App() {
  const [cpf, setCpf] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  const handleBuscar = async () => {
    setErro("");
    setResultado(null);

    if (!cpf.trim()) {
      setErro("Digite um CPF válido.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost/Sistema%20de%20rastreamento/app/backend/public/entregas?cpf=${cpf}`
      );

      if (!res.ok) throw new Error("Erro ao buscar entregas");

      const data = await res.json();
      setResultado(data);
    } catch (e) {
      setErro("Não foi possível buscar as entregas.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem" }}>Rastreamento</h2>
        <input
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
          }}
        />
        <button
          onClick={handleBuscar}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Buscar
        </button>

        {erro && <p style={{ color: "red", marginTop: "1rem" }}>{erro}</p>}

        {resultado && (
          <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
            <h4>Resultado:</h4>
            <pre
              style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "6px",
                overflowX: "auto",
              }}
            >
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
