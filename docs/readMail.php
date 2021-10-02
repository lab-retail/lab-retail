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
                    
                    foreach ($emailData as $emailIdent) {
                        $overview = imap_fetch_overview($connection, $emailIdent, 0);
                        $date = date('d F Y', strtotime($overview[0]->date));
                        $message = imap_fetchbody($connection, $emailIdent, '1');
                        $messageExcerpt = substr($message, 0, 150);
                        $emailContent = substr(quoted_printable_decode($messageExcerpt), 0, 30); 
                        
                        $emailObject = new stdClass();
                        $emailObject->date   = $date;

                        // echo "emailContent: <" . $emailContent . ">" .PHP_EOL;
                        $emailObject->id     = substr($emailContent, 1, 1);
                        $emailObject->todos  = substr($emailContent, 3, 3);
                        $emailObject->prodW  = substr($emailContent, 7, 3);
                        $emailObject->prodX  = substr($emailContent, 11, 3);
                        $emailObject->prodY  = substr($emailContent, 15, 3);
                        $emailObject->prodZ  = substr($emailContent, 19, 3);
                        $emailObject->nivel  = substr($emailContent, 23, 1);
                        $emailObject->mayor  = substr($emailContent, 25, 2);
                        $emailObject->peor   = substr($emailContent, 28, 2);
                        
                        array_push($jsonObject, $emailObject);
                    } // End foreach
                    
                    // Reverse the Array so last e-mail will be first
                    $jsonObject = array_reverse($jsonObject);
                    
                    // PHP will only provide 10 elements to JSON
                    if(count($jsonObject > 10)){
                        $jsonObject = array_slice($jsonObject, 0, 10);
                    }
                    
                    // convert the array into a JSON object
                    $jsonContent = json_encode($jsonObject).PHP_EOL;
                    
                    // Deliver JSON file to javascript
                    echo $jsonContent;
                } // end if
            } // end else
                
            imap_close($connection);
        }
    }
?>