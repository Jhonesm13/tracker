<?php
namespace App\Repositories;

use App\Database\Database;
use PDO;

class EntregasRepository {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    public function buscarPorCpf(string $cpf): array {
        // Buscar entregas que o destinatario (json) tenha o CPF informado 
        $stmt = $this->pdo->prepare("
            SELECT
                e.id,
                e.volumes, 
                e.remetente, 
                e.destinatario, 
                e.rastreamento, 
                t.fantasia AS transportadora_nome
            FROM entregas e 
            LEFT JOIN transportadoras t ON t.id = e.id_transportadora
            WHERE JSON_EXTRACT(e.destinatario, '$._cpf') = :cpf
        ");
        $stmt->execute(['cpf' => $cpf]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function salvarEntrega(array $entrega): void {
        $stmt = $this->pdo->prepare("
            INSERT INTO entregas (id, id_transportadora, volumes, remetente, destinatario, rastreamento)
            VALUES (:id, :id_transportadora, :volumes, :remetente, :destinatario, :rastreamento)
        ");

        $stmt->execute([
            'id' => $entrega['_id'],
            'id_transportadora' => $entrega['_id_transportadora'],
            'volumes' => $entrega['_volumes'],
            'remetente' => json_encode($entrega['_remetente']),
            'destinatario' => json_encode($entrega['_destinatario']),
            'rastreamento' => json_encode($entrega['_rastreamento'])
        ]);
    }
}