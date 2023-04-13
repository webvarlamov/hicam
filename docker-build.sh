rm -R ./src/main/resources/static/private/admin;
mkdir ./src/main/resources/static/private/admin;
pwd
cd ./frontend/admin/ && npm install && ng build --configuration production;
cd ../../ && mvn package -P docker -DskipTests;
docker build -t cr.yandex/crp3g2ebtfsh3buhv6q0/hicam:0.0.14 .

