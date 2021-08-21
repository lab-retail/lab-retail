<?php
    require_once('../includes/data.php');
    
    class mailReader {

        public function readMail() {
            if (! function_exists('imap_open')) {
                echo "IMAP is not configured.".PHP_EOL;
                exit();
            }
            else {
                $path       = '/var/www/docs/json/';
                $fileName   = $path . date('m-d-Y').'.json'; // Date format is month-day-year
                $txtContent = '';
                $jsonContent= '';
                $jsonObject = array();
        
                $username   = USER;
                $password   = PASS;
                $mailbox    = MAILBOX;
        
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
                    $jsonContent .= '{ "dates":';
        
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
        
                        array_push($jsonObject, array(
                            "date" => $date,
                            "value" => $int
                            )
                        );

                        $txtContent .=  $date . ' -  Valor: ' . $int . PHP_EOL;
                        // $jsonContent .= '{ "date" : "' . $date .'", "value" : "' . $int .'"},';
                    } // End foreach
        
                    $jsonContent .= json_encode($jsonObject).PHP_EOL;
                    $jsonContent .= '}';
                    echo $jsonContent;
                    // $jsonContent .= ']}';
                    // echo 'Total sumado: ' . $total . PHP_EOL;
                    $txtContent .= 'Total sumado: ' . $total . PHP_EOL;
                    // using the FILE_APPEND flag to append the content to the end of the file
                    // and the LOCK_EX flag to prevent anyone else writing to the file at the same time
                    $myfile = file_put_contents($fileName, $jsonContent.PHP_EOL , FILE_APPEND | LOCK_EX);
        
                } // end if
            } // end else
                
            imap_close($connection);
        }
    }
?>