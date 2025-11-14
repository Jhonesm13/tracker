<?php
use Slim\App;
use App\Controllers\EntregasController;

return function (App $app) {
    // rota para listar entregas (ex: GET /entregas?cpf=...)
    $app->get('/entregas', [EntregasController::class, 'listar']);
};