<?php
    // mensaje Setiembre 2021     I1T###X###Y###N#H##P##
    require_once('./data.php');
    
    class mailReader {

        public function readMail() {
            if (! function_exists('imap_open')) {
                echo "IMAP is not configured.".PHP_EOL;
                exit();
            }
            else {
                $jsonContent= '';
                $jsonObject = array();
        
                $username   = USER;
                $password   = PASS;
                $mailbox    = MAILBOX;
        
                $connection = imap_open($mailbox, $username, $password) or die('Cannot connect to Mailbox: ' . imap_last_error());
        
                /* Get all e-mails */
                // imap_search https://www.php.net/manual/en/function.imap-search.php
                $emailData = imap_search($connection, 'ALL');
                // $emailData = imap_search($connection, 'UNSEEN');
                // $emailData = imap_search($connection, 'SUBJECT "Airbnb"');
        
        
                if (! empty($emailData)) {
                    // $jsonContent .= '{ "dates":';

                    foreach ($emailData as $emailIdent) {
                        $overview = imap_fetch_overview($connection, $emailIdent, 0);
                        $message = imap_fetchbody($connection, $emailIdent, '1');
                        $messageExcerpt = substr($message, 0, 150);
                        $date = date('d F Y', strtotime($overview[0]->date));
                        $emailContent = substr(quoted_printable_decode($messageExcerpt), 0, 30); 
                        
                        $dateObject = new stdClass();
                        $dateObject->date   = $date;
                        $dateObject->id     = substr($emailContent, 1, 1);
                        $dateObject->todos  = substr($emailContent, 3, 3);
                        $dateObject->prodW  = substr($emailContent, 7, 3);
                        $dateObject->prodX  = substr($emailContent, 11, 3);
                        $dateObject->prodY  = substr($emailContent, 15, 3);
                        $dateObject->prodZ  = substr($emailContent, 19, 3);
                        $dateObject->nivel  = substr($emailContent, 23, 1);
                        $dateObject->mayor  = substr($emailContent, 25, 2);
                        $dateObject->peor   = substr($emailContent, 27, 2);
                        
                        array_push($jsonObject, $dateObject);
                    } // End foreach
        
                    $jsonContent = json_encode(array_reverse($jsonObject)).PHP_EOL;
                    echo $jsonContent;
        
                } // end if
            } // end else
                
            imap_close($connection);
        }
    }
?>