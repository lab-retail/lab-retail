# 2021 PHP Mail - OUT CR

## Pasos para settear ambiente local en Ubuntu:

0. Verificar qué versión de PHP usa Ubuntu -> checkear phpinfo() 
Si por ejemplo el sistema usa la versión 7.0.4, se deben ajustar los comandos a php 7.0

1. En una terminal, instalar php imap (varía según la versión de PHP)

```sudo apt install php7.0-imap```

```sudo phpenmod imap```

```sudo service apache2 restart```
