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

        // Se não tiver, então busca nas API
        // Busca na API de entregas (mock)
        $urlEntregas = 'https://26197381-eb3d-4bf0-81b1-2d1823acb2b3.mock.pstmn.io/API_LISTAGEM_ENTREGAS';
        $responseEntregas = @file_get_contents($urlEntregas);

        if (!$responseEntregas) {
            throw new \Exception('Falha ao acessar a API de entregas.');
        }

        $responseEntregas_utf8 = mb_convert_encoding($responseEntregas, 'UTF-8', 'UTF-8');
        $dadosEntregas = json_decode($responseEntregas_utf8, true);


        if (!isset($dadosEntregas['data']) || !is_array($dadosEntregas['data'])) {
            throw new \Exception('Formato inesperado de resposta da API.');
        }

        // Filtra apenas as entregas com o CPF desejado
        $filtradas = array_filter($dadosEntregas['data'], function ($e) use ($cpf) {
            return is_array($e)
                && isset($e['_destinatario']['_cpf'])
                && $e['_destinatario']['_cpf'] === $cpf;
        });

        // Busca na API de transportadoras (mock)
        $listaTransportadoras = [];
        $urlTransp = 'https://26197381-eb3d-4bf0-81b1-2d1823acb2b3.mock.pstmn.io/API_LISTAGEM_TRANSPORTADORAS';
        $respTransp = @file_get_contents($urlTransp);

        // Se a API respondeu, decodifica e guarda a lista
        if ($respTransp) {
            $jsonTransp = json_decode(mb_convert_encoding($respTransp, 'UTF-8', 'UTF-8'), true);
            $listaTransportadoras = $jsonTransp['data'] ?? [];
        }
        
        $entregasParaRetorno = [];
        
        foreach ($filtradas as $entrega) {
            $idBusca = $entrega['_id_transportadora'];
            $nomeTransportadora = 'Transportadora Indefinida';


            // Se tem ID e a lista não ta vazia, procura a transportadora
            if ($idBusca && !empty($listaTransportadoras)) {
                // Filtra a lista procurando o ID igual ao da entrega
                $encontradas = array_filter($listaTransportadoras, function($t) use ($idBusca) {
                    return ($t['_id']) === $idBusca;
                });

                // Pega o primeiro item encontrado
                $transportadoraEncontrada = reset($encontradas); 

                if ($transportadoraEncontrada) {
                    $nomeFantasia = $transportadoraEncontrada['_fantasia'] ?? null;
                    
                    if ($nomeFantasia) {
                        $this->repository->salvarTransportadora([
                            'id'       => $transportadoraEncontrada['_id'],
                            'fantasia' => $nomeFantasia,
                            'cnpj'     => $transportadoraEncontrada['_cnpj']
                        ]);
                        $nomeTransportadora = $nomeFantasia;
                    }
                }
            }
            
            // Salva e Retorna Entrega
            $entrega['transportadora'] = $nomeTransportadora;
            $this->repository->salvarEntrega($entrega);
            $entregasParaRetorno[] = $entrega;
        }

        return ['cpf' => $cpf, 'entregas' => $entregasParaRetorno];
    }
}