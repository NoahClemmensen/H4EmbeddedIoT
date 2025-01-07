FROM ubuntu:latest
LABEL authors="noahclemmensen"

ENTRYPOINT ["top", "-b"]