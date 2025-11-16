<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Cube;
use App\Service\Router;
use App\Service\Templating;

class RubiksController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $cubes = Cube::findAll();
        $html = $templating->render('cube/index.html.php', [
            'cubes' => $cubes,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestCube, Templating $templating, Router $router): ?string
    {
        if ($requestCube)
        {
            $cube = Cube::fromArray($requestCube);
            $cube->save();

            $path = $router->generatePath('cube-index');
            $router->redirect($path);
            return null;
        }
        else
        {
            $cube = new Cube();
        }

        $html = $templating->render('cube/create.html.php', [
            'cube' => $cube,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $cubeId, ?array $requestCube, Templating $templating, Router $router): ?string
    {
        $cube = Cube::find($cubeId);
        if (! $cube)
        {
            throw new NotFoundException("Can not find $cubeId");
        }

        if ($requestCube)
        {
            $cube->fill($requestCube);
            $cube->save();

            $path = $router->generatePath('cube-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('cube/edit.html.php', [
            'cube' => $cube,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $cubeId, Templating $templating, Router $router): ?string
    {
        $cube = Cube::find($cubeId);
        if (! $cube)
        {
            throw new NotFoundException("Can not find $cubeId");
        }

        $html = $templating->render('cube/show.html.php', [
            'cube' => $cube,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $cubeId, Router $router): ?string
    {
        $cube = Cube::find($cubeId);
        if (! $cube)
        {
            throw new NotFoundException("Can not find $cubeId");
        }

        $cube->delete();
        $path = $router->generatePath('cube-index');
        $router->redirect($path);
        return null;
    }
}