<?php

/** @var \App\Model\Cube[] $cubes */
/** @var \App\Service\Router $router */

$title = 'Cube List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Cubes List</h1>

    <a href="<?= $router->generatePath('cube-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($cubes as $cube): ?>
            <li><h3><?= $cube->getType() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('cube-show', ['id' => $cube->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('cube-edit', ['id' => $cube->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
