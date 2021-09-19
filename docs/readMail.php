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
        
                /* Search Emails having the specified keyword in the email subject */
                // $emailData = imap_search($connection, 'SUBJECT "Article "');
        
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
                        $date = date('d F, Y, H:i:s', strtotime($overview[0]->date));
                        $emailContent = substr(quoted_printable_decode($messageExcerpt), 0, 22); 

                        $dateObject = new stdClass();
                        $dateObject->date   = $date;
                        $dateObject->id     = substr($emailContent, 1, 1);
                        $dateObject->todos  = substr($emailContent, 3, 3);
                        $dateObject->prodX  = substr($emailContent, 7, 3);
                        $dateObject->prodY  = substr($emailContent, 11, 3);
                        $dateObject->nivel  = substr($emailContent, 15, 1);
                        $dateObject->mayor  = substr($emailContent, 17, 2);
                        $dateObject->peor   = substr($emailContent, 20, 2);

                        array_push($jsonObject, $dateObject);
                    } // End foreach
        
                    $jsonContent = json_encode($jsonObject).PHP_EOL;
                    echo $jsonContent;
        
                } // end if
            } // end else
                
            imap_close($connection);
        }

        public function parseEmailContent($dateString, $emailContentString){
            $emailContentArray = array();

            array_push(
                $emailContentArray,
                array(
                    "date" => $dateString,
                    "id"    => substr($emailContentString, 1, 1),
                    "todos" => substr($emailContentString, 3, 3),
                    "prodX" => substr($emailContentString, 7, 3),
                    "prodY" => substr($emailContentString, 11, 3),
                    "nivel" => substr($emailContentString, 15, 1),
                    "mayor" => substr($emailContentString, 17, 2),
                    "peor" => substr($emailContentString, 20, 2)
                )
            );
            /*
            I1T###X###Y###N#H##P##
            pos[0] = i
            pos[2] = T
            pos[6] = X
            pos[10] = Y
            pos[14] = N
            pos[16] = H
            pos[19] = P
            */
      
            return (object)$emailContentArray;
        }
    }
?>