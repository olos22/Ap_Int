<?php

/** @var \App\Model\Cube $cube */
/** @var \App\Service\Router $router */

$title = "Edit Cube {$cube->getType()} ({$cube->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('cube-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="cube-edit">
        <input type="hidden" name="id" value="<?= $cube->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('cube-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('cube-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="cube-delete">
                <input type="hidden" name="id" value="<?= $cube->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
