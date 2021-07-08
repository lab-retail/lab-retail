#!/usr/bin/env bash

locale-gen UTF-8
export LANGUAGE=en_US.UTF-8; export LANG=en_US.UTF-8; export LC_ALL=en_US.UTF-8; locale-gen en_US.UTF-8
dpkg-reconfigure locales
sh -c "echo -e 'LANG=en_US.UTF-8\nLC_ALL=en_US.UTF-8' > /etc/environment"
#reboot
apt-get update

# apache
apt-get install -y apache2
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi


#php
apt-get -y install php5 libapache2-mod-php5 php5-mcrypt php5-imap

php5enmod imap

# set up apache
match='DocumentRoot.*'
insert='ServerName localhost\n\tDocumentRoot /vagrant\n\t<Directory /vagrant/>\n\t\tRequire all granted\n\t</Directory>'
file='/etc/apache2/sites-available/000-default.conf'
cat $file
sed -i "s:$match:$insert:" $file

match='#<Directory /srv/>'
insert='<Directory /vagrant/>\n\tOptions Indexes FollowSymLinks\n\tAllowOverride All\n\tOptions Indexes FollowSymLinks\n\tRequire all granted\n\t</Directory>\n\n#<Directory /srv/>'
file='/etc/apache2/apache2.conf'
cat $file
sed -i "s:$match:$insert:" $file

a2enmod rewrite
service apache2 restart