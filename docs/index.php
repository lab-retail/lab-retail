<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Lab Retail - OUT 2021</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="HandheldFriendly" content="true">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="stylesheet" href="css/styles.css" media="screen">
    </head>
    <body>
        <main>
            <h1>Lab Retail - Demo - August 2021</h1>

            <div id="mainTable">
                <div class="columnHeader item">DateTime</div>
                <div class="columnHeader item">ProdX</div>
                <div class="columnHeader item">ProdY</div>
            </div>

            <section>
                <h2>Total: <span id="total"></span></h2>
            </section>
        </main>
   
        <?php
            require_once('readMail.php');
            $currentData = new mailReader();
        ?>

        <script src="./js/d3.v5.min.js"></script>
        <script>let dataset = <?php $currentData->readMail(); ?>;</script>
        <script src="./js/main.js"></script>
    </body>
</html>
