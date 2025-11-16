<?php

/** @var \App\Model\Cube $cube */
/** @var \App\Service\Router $router */

$title = 'Create Cube';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Cube</h1>
    <form action="<?= $router->generatePath('cube-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="cube-create">
    </form>

    <a href="<?= $router->generatePath('cube-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
