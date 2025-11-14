<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\EntregasService;

class EntregasController {
    private $service;

    public function __construct() {
        $this->service = new EntregasService();
    }

    // GET /entregas?cpf=
    public function listar(Request $request, Response $response): Response {
        $params = $request->getQueryParams();
        $cpf = $params['cpf'] ?? null;

        if (!$cpf) {
            $payload = ['error' => true, 'message' => 'O CPF é obrigatório'];
            $response->getBody()->write(json_encode($payload));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $dados = $this->service->buscarEntregasPorCpf($cpf);

        $response->getBody()->write(json_encode($dados));
        return $response->withHeader('Content-Type', 'application/json');
    }
}