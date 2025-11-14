<?php
namespace App\Services;

use App\Repositories\EntregasRepository;

class EntregasService {
    private $repository;

    public function __construct() {
        $this->repository = new EntregasRepository();
    }

    public function buscarEntregasPorCpf(string $cpf): array {
        // Verifica se já existe alguma entrega cadastrada no banco
        $entregas = $this->repository->buscarPorCpf($cpf);

        if (!empty($entregas)) {
            $entregas_decodificadas = array_map(function ($entrega) {
                // Decodifica as strings JSON salvas no banco de dados para arrays PHP
                $entrega['remetente']    = json_decode($entrega['remetente'], true);
                $entrega['destinatario'] = json_decode($entrega['destinatario'], true);
                $entrega['rastreamento'] = json_decode($entrega['rastreamento'], true);
                $entrega['transportadora'] = $entrega['transportadora_nome'] ?? null;
                unset($entrega['transportadora_nome']);

                return $entrega;
            }, $entregas);

            return [
                'cpf' => $cpf,
                'entregas' => $entregas_decodificadas
            ];
        }

        // Busca na API (mock)
        $url = 'https://26197381-eb3d-4bf0-81b1-2d1823acb2b3.mock.pstmn.io/API_LISTAGEM_ENTREGAS';
        $response = @file_get_contents($url);

        if (!$response) {
            throw new \Exception('Falha ao acessar a API externa.');
        }

        $response_utf8 = mb_convert_encoding($response, 'UTF-8', 'UTF-8');
        $dados = json_decode($response_utf8, true);


        if (!isset($dados['data']) || !is_array($dados['data'])) {
            throw new \Exception('Formato inesperado de resposta da API.');
        }

        // Filtra apenas as entregas com o CPF desejado
        $filtradas = array_filter($dados['data'], function ($e) use ($cpf) {
            return is_array($e)
                && isset($e['_destinatario']['_cpf'])
                && $e['_destinatario']['_cpf'] === $cpf;
        });

        // Salva no banco as entregas encontradas
        foreach ($filtradas as $entrega) {
            $this->repository->salvarEntrega($entrega);
        }

        return [
            'cpf' => $cpf,
            'entregas' => array_values($filtradas)
        ];
    }
}