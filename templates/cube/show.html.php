<?php

/** @var \App\Model\Cube $cube */
/** @var \App\Service\Router $router */

$title = "{$cube->getType()} ({$cube->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $cube->getType() ?></h1>
    <article>
        <?= $cube->getSize();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('cube-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('cube-edit', ['id'=> $cube->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
