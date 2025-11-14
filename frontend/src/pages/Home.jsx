import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [cpf, setCpf] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBuscar = async () => {
        setErro("");

        const cpfLimpo = cpf.replace(/\D/g, "");

        if (!cpfLimpo.trim()) {
            setErro("Digite um CPF válido.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost/Sistema%20de%20rastreamento/app/backend/public/entregas?cpf=${cpfLimpo}`
            );

            if (!res.ok) {
                let errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Erro na resposta do servidor.");
            }

            const entregas = await res.json();

            if (!entregas || entregas.length === 0) {
                setErro("Nenhuma entrega encontrada para este CPF.");
                return;
            }

            navigate("/entregas", { state: { entregas } });

        } catch (err) {
            setErro(err.message || "Não foi possível buscar as entregas.");
        } finally {
            setLoading(false);
        }
    };

    const handleCpfChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");

        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        setCpf(value);
    };


    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <img
                    src="/logo_colorido.png"
                    alt="Rastreamento"
                    style={styles.iconeRastreio}
                />
                <h1 style={styles.titulo}>Rastreie sua Entrega</h1>
                <p style={styles.subtitulo}>
                    Insira o seu CPF para visualizar todas as suas encomendas.
                </p>

                <input
                    type="text"
                    placeholder="Ex: 000.000.000-00"
                    maxLength={14}
                    value={cpf}
                    onChange={handleCpfChange}
                    style={{ ...styles.input, borderColor: erro ? '#E53935' : '#D0D9E0' }}
                    disabled={loading}
                />

                <button
                    onClick={handleBuscar}
                    style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                    disabled={loading}
                >
                    {loading ? 'Buscando...' : 'Buscar Entregas'}
                </button>

                {erro && <p style={styles.erro}>{erro}</p>}

            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#E3F2FD",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
        overflow: 'hidden',
    },
    decoracaoFundo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #BBDEFB 0%, #E3F2FD 100%)',
        opacity: 0.3,
        zIndex: 0,
    },
    card: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "450px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        position: 'relative',
        zIndex: 1,
    },
    iconeRastreio: {
        width: '100%',
        height: '80px',
        marginBottom: '10px',
        display: 'block',
        objectFit: 'contain'
    },
    titulo: {
        fontSize: '1.8rem',
        fontWeight: 700,
        color: '#1A237E',
        marginBottom: '5px',
    },
    subtitulo: {
        fontSize: '1rem',
        color: '#607D8B',
        marginBottom: '25px',
    },
    input: {
        width: "90%",
        padding: "15px",
        borderRadius: "8px",
        border: "2px solid #D0D9E0",
        marginBottom: "1.5rem",
        fontSize: '1rem',
        textAlign: 'center',
        transition: 'border-color 0.3s',
        ':focus': {
            borderColor: '#2196F3',
            outline: 'none',
        }
    },
    button: {
        width: "100%",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#FF811B",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: '1.1rem',
        transition: 'background-color 0.3s, opacity 0.3s',
        boxShadow: "0 4px 10px rgba(33, 150, 243, 0.3)",
        ':hover': {
            backgroundColor: '#1E88E5',
        },
        ':disabled': {
            cursor: 'not-allowed',
        }
    },
    erro: {
        color: "#E53935",
        marginTop: "1rem",
        fontWeight: 600,
        backgroundColor: '#FFEBEE',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #E53935'
    }
};