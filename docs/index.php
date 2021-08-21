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
        <h1>Lab Retail - Demo - August 2021</h1>

        <div id="mainTable">
            <div class="columnHeader item">DateTime</div>
            <div class="columnHeader item">Value</div>
        </div>

        <section>
            <h2 id="subTitle">Total: <span id="total"></span></h2>

            <div id="donutChart"></div>

            <div id="chart" class="chartContainer"></div>
        </section>
   
        <?php
            require_once('readMail.php');
            $currentData = new mailReader();
        ?>

        <script src="./js/d3.v5.min.js"></script>
        <script>let dataset = <?php $currentData->readMail(); ?>;</script>
        <script src="./js/main.js"></script>
    </body>
</html>
