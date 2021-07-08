# 2021 PHP Mail - OUT CR

Esta aplicación corre en una terminal.
Una vez que el ambiente local esté listo, usar el comando php en una terminal:
```php mail.php```

## Pasos para settear ambiente local en Ubuntu:

1. En una terminal, instalar php5-imap ```sudo apt-get install php5-imap```
Podría variar según la versión de php.

2. ```sudo php5enmod imap```

3. Reiniciar apache para que los cambios tengan efecto ```sudo service apache2 restart```


## Pasos para settear ambiente local en Mac OSX
1. En una terminal, instalar php-ext  ```brew tap kabel/php-ext```

2. Instalar php-imap ```brew install php-imap```
