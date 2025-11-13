<?php
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();
$app->setBasePath(dirname($_SERVER['SCRIPT_NAME']));

$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

// importa as rotas
(require __DIR__ . '/../src/routes.php')($app);

// rota inicial (index)
$app->get('/', function ($request, $response) {
    $response->getBody()->write("Ta funcionando");
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

$app->run();