FROM mysql:5.7
ENV MYSQL_DATABASE="SwacchIITB" \
    MYSQL_ROOT_PASSWORD="Aks@253854" \
    MYSQL_USER="root"
COPY init_db.sql /docker-entrypoint-initdb.d/
