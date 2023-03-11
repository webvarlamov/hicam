FROM openjdk:17
COPY target/hicam.jar hicam.jar
ENTRYPOINT java -jar hicam.jar
