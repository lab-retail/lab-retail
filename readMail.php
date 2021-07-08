<?php
    if (! function_exists('imap_open')) {
        echo "IMAP is not configured.";
        exit();
    }
    else {
        $username = "lab_retail@outstudio.co";
        $password = "un1corN*2021";
        $mailbox = '{mail.outstudio.co:993/ssl/novalidate-cert}';

        $connection = imap_open($mailbox, $username, $password) or die('Cannot connect to Mailbox: ' . imap_last_error());

        /* Search Emails having the specified keyword in the email subject */
        // $emailData = imap_search($connection, 'SUBJECT "Article "');

        /* Get all e-mails */
        // imap_search https://www.php.net/manual/en/function.imap-search.php
        $emailData = imap_search($connection, 'ALL');
        // $emailData = imap_search($connection, 'NEW');
        // $emailData = imap_search($connection, 'SUBJECT "Airbnb"');


        if (! empty($emailData)) {
            
            $total = 0;
            
            foreach ($emailData as $emailIdent) {
                // imap_fetch_body
                // ()Root Message Part (multipart/related)
                // (1) The text parts of the message (multipart/alternative)
                // (1.1) Plain text version (text/plain)
                // (1.2) HTML version (text/html)
                // (2) The background stationary (image/gif)
                $overview = imap_fetch_overview($connection, $emailIdent, 0);
                $message = imap_fetchbody($connection, $emailIdent, '1');
                $messageExcerpt = substr($message, 0, 150);
                $date = date('d F, Y, H:i:s', strtotime($overview[0]->date));
                $emailContent = quoted_printable_decode($messageExcerpt); 
                $int = (int) filter_var($emailContent, FILTER_SANITIZE_NUMBER_INT);
                $total += $int;

                // echo $overview[0]->from; 
                // echo $overview[0]->subject; 
                //echo $overview[0]->subject;
                // echo $partialMessage;
                echo 'Fecha: ' . $date . ' -  Valor: ' . $int . PHP_EOL;
                
            } // End foreach
            echo 'Total sumado: ' . $total;
        } // end if
    } // end else
        
    imap_close($connection);
?>