<?php
    /** @var $cube ?\App\Model\Cube */
?>

<div class="form-group">
    <label for="type">Type</label>
    <input type="text" id="type" name="cube[type]" value="<?= $cube ? $cube->getType() : '' ?>">
</div>

<div class="form-group">
    <label for="size">Size</label>
    <textarea id="size" name="cube[size]"><?= $cube? $cube->getSize() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
