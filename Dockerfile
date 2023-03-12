FROM openjdk:17
COPY target/hicam.jar hicam.jar
ADD keystore.p12 /etc/letsencrypt/live/hicam.varlamov.dev/keystore.p12
ENTRYPOINT java -jar hicam.jar
