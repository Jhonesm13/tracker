import { useLocation } from "react-router-dom";

export default function ListaEntregas() {
    const { state } = useLocation();
    let entregas = state?.entregas?.entregas || state?.entregas || [];

    if (!Array.isArray(entregas)) entregas = [];

    entregas = entregas.map((e) => {
        const id = e.id || e._id;
        const transportadora = e.id_transportadora || e._id_transportadora;
        const volumes = e.volumes || e._volumes;

        const remetente =
            typeof e.remetente === "string"
                ? JSON.parse(e.remetente)
                : e.remetente || e._remetente || {};

        const destinatario =
            typeof e.destinatario === "string"
                ? JSON.parse(e.destinatario)
                : e.destinatario || e._destinatario || {};

        const rastreamento =
            typeof e.rastreamento === "string"
                ? JSON.parse(e.rastreamento)
                : e.rastreamento || e._rastreamento || [];

        return { id, transportadora, volumes, remetente, destinatario, rastreamento };
    });

    if (!entregas.length) {
        return (
            <div style={styles.vazioContainer}>
                <span role="img" aria-label="emoji triste" style={{ fontSize: 40 }}>😞</span>
                <p style={styles.vazioTexto}>
                    Nenhuma entrega encontrada.
                </p>
            </div>
        );
    }

    return (
        <div style={styles.principalContainer}>
            <h1 style={styles.tituloPrincipal}>📦 Suas Entregas</h1>
            <p style={styles.subtituloPrincipal}>{entregas.length} entregas em andamento ou concluídas.</p>
            <hr style={styles.separadorPrincipal} />

            {entregas.map((e) => {
                const ultimoStatus =
                    e.rastreamento?.length > 0
                        ? e.rastreamento[e.rastreamento.length - 1].message.toUpperCase()
                        : "STATUS NÃO DISPONÍVEL";

                const etapas = ["ENTREGA CRIADA", "EM TRÂNSITO", "SAIU PARA ENTREGA", "ENTREGA REALIZADA"];
                const etapaAtual = etapas.indexOf(ultimoStatus);
                const isFinalizado = ultimoStatus === "ENTREGA REALIZADA";

                const enderecoCompleto =
                    `${e.destinatario?._endereco || "Endereço não informado"}, ` +
                    `${e.destinatario?._estado || ""}, ` +
                    `${e.destinatario?._cep || ""}, ` +
                    `${e.destinatario?._pais || ""}`;

                const geo =
                    e.destinatario?._geolocalizao ||
                    e.destinatario?._geolocalizacao ||
                    {};

                const lat = geo._lat;
                const lng = geo._lng;

                const cardStyle = {
                    ...styles.card,
                    borderLeft: `5px solid ${isFinalizado ? '#4CAF50' : '#2196F3'}`,
                };

                const InfoLine = ({ icon, label, value }) => (
                    <div style={styles.infoLinha}>
                        <div style={styles.infoIconContainer}>
                            <span style={styles.infoIcon}>{icon}</span>
                        </div>
                        <div style={styles.infoTextoContainer}>
                            <span style={styles.label}>{label}</span>
                            <span style={styles.valor}>{value}</span>
                        </div>
                    </div>
                );

                return (
                    <div key={e.id} style={cardStyle}>

                        { /* HEADER DO CARD - ID e Status */}
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitulo}>
                                N. Rastreio: **{e.id}**
                            </h3>
                            <span style={{
                                ...styles.cardStatus,
                                background: isFinalizado ? '#E8F5E9' : '#E3F2FD',
                                color: isFinalizado ? '#2E7D32' : '#1565C0',

                            }}>
                                {isFinalizado ? 'Entregue ✅' : 'Em Andamento ⏳'}
                            </span>
                        </div>

                        <hr style={styles.separadorCard} />

                        {/* ETAPAS DE STATUS */}
                        <div style={{ marginBottom: 25 }}>
                            <span style={styles.labelHeader}>Progresso da Entrega</span>

                            <div style={styles.etapasContainer}>
                                {etapas.map((s, idx) => (
                                    <div
                                        key={s}
                                        style={{
                                            ...styles.etapa,
                                            background: idx <= etapaAtual ? ('#4CAF50' : '#2196F3') : '#ECEFF1',
                                            color: idx <= etapaAtual ? "#fff" : "#607D8B",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                            <p style={styles.ultimoStatusTexto}>
                                **Último Status:** *{ultimoStatus}*
                            </p>
                        </div>

                        <hr style={styles.separadorCard} />

                        {/* INFORMAÇÕES DETALHADAS */}
                        <div style={styles.infoGrid}>
                            <InfoLine icon="📦" label="Volumes" value={e.volumes || 'N/A'} />
                            <InfoLine icon="🚛" label="Transportadora" value={e.transportadora || 'N/A'} />
                            <InfoLine icon="👤" label="Remetente" value={e.remetente?._nome || 'N/A'} />
                            <InfoLine icon="📍" label="Destinatário" value={e.destinatario?._nome || 'N/A'} />
                            <InfoLine icon="💳" label="CPF/CNPJ" value={e.destinatario?._cpf || 'N/A'} />
                        </div>

                        <hr style={styles.separadorCard} />

                        {/* ENDEREÇO */}
                        <div style={{ marginBottom: 15 }}>
                            <InfoLine icon="🏠" label="Endereço de Entrega" value={enderecoCompleto} />
                        </div>


                        {/* MAPA */}
                        {lat && lng ? (
                            <div style={{ padding: "10px 0" }}>
                                <span style={styles.labelHeader}>Localização Estimada</span>

                                <iframe
                                    key={`${lat}-${lng}`}
                                    width="100%"
                                    height="250"
                                    loading="lazy"
                                    style={{
                                        borderRadius: 10,
                                        marginTop: 10,
                                        border: "1px solid #ddd",
                                        minHeight: 250
                                    }}
                                    src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                                ></iframe>
                            </div>
                        ) : (
                            <p style={{ color: "#999", marginTop: 10 }}>Localização não disponível</p>
                        )}

                    </div>
                );
            })}
        </div>
    );
}

const styles = {
    // CONTAINER
    principalContainer: {
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        background: "#F5F7FA",
        minHeight: "100vh",
    },
    tituloPrincipal: {
        fontSize: "2.2em",
        fontWeight: 700,
        color: "#1A237E",
        marginBottom: "5px",
    },
    subtituloPrincipal: {
        fontSize: "1em",
        color: "#607D8B",
        marginBottom: "15px",
    },
    separadorPrincipal: {
        border: "none",
        borderTop: "1px solid #E0E0E0",
        marginBottom: "25px",
    },
    separadorCard: {
        border: "none",
        borderTop: "1px dashed #EEEEEE",
        margin: "15px 0",
    },
    vazioContainer: {
        textAlign: "center",
        marginTop: "80px",
        padding: "20px",
    },
    vazioTexto: {
        fontSize: "1.2em",
        color: "#607D8B",
        marginTop: "15px",
    },

    // CARD
    card: {
        padding: 25,
        background: "#fff",
        borderRadius: 12,
        marginBottom: 25,
        border: "1px solid #E0E0E0",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.2s",
        ":hover": {
            transform: "translateY(-2px)"
        },
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    cardTitulo: {
        fontSize: "1.4em",
        color: "#303F9F",
        fontWeight: 600,
        margin: 0,
    },
    cardStatus: {
        padding: "5px 10px",
        borderRadius: 20,
        fontSize: "0.85em",
        fontWeight: 700,
        textTransform: "uppercase",
    },

    // INFO LINHAS
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
    },
    infoLinha: {
        display: "flex",
        alignItems: "center",
    },
    infoIconContainer: {
        marginRight: 10,
        width: 35,
        height: 35,
        borderRadius: "50%",
        background: "#F5F7FA",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    infoIcon: {
        fontSize: "1.1em",
    },
    infoTextoContainer: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    labelHeader: {
        fontSize: 14,
        color: "#9E9E9E",
        marginBottom: 5,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'block'
    },
    label: {
        fontSize: 11,
        color: "#9E9E9E",
        display: "block",
        fontWeight: 500,
        textTransform: 'uppercase',
    },
    valor: {
        fontSize: 16,
        fontWeight: 600,
        color: "#263238",
        lineHeight: 1.3,
        wordBreak: 'break-word',
    },

    // ETAPAS DE STATUS
    etapasContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8, 
        marginTop: 10,
    },
    etapa: {
        padding: "10px 5px",
        borderRadius: 8,
        fontSize: 11,
        textAlign: "center",
        fontWeight: 500,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        lineHeight: 1.2,
    },
    ultimoStatusTexto: {
        textAlign: 'center',
        fontSize: 13,
        color: '#607D8B',
        marginTop: 10,
        fontStyle: 'italic',
    }
};