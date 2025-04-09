#!/bin/bash
# Indítjuk a backend-et
java -jar -Dspring.profiles.active=dev be-changer-1.1.0.jar &

# Indítjuk a Keycloak-ot
/opt/keycloak/bin/kc.sh start-dev &

# Indítjuk az Nginx-et
nginx -g 'daemon off;'
