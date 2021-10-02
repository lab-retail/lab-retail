<?php
    require_once('readMail.php');
    $currentData = new mailReader();
    echo PHP_EOL;
    $currentData->readMail();
    echo PHP_EOL;
?>