# 2021 PHP Mail - OUT CR

Esta aplicación corre en una terminal.
Una vez que el ambiente local esté listo, usar el comando php en una terminal:
```php mail.php```

## Pasos para settear ambiente local en Ubuntu:

0. Verificar qué versión de PHP usa Ubuntu -> checkear phpinfo() 
Si por ejemplo el sistema usa la versión 7.0.4, se deben ajustar los comandos a pnp 7.0

1. En una terminal, instalar php imap (varía según la versión de PHP)
```sudo apt install php7.0-imap```
```sudo phpenmod imap```
```sudo service apache2 restart```


## Pasos para settear ambiente local en Mac OSX
1. En una terminal, instalar php-ext  ```brew tap kabel/php-ext```

2. Instalar php-imap ```brew install php-imap```
