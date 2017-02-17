FROM python:2.7.13-onbuild
RUN apt-get update -y \
  && apt-get install curl

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g bower

WORKDIR /usr/src/app/app
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN bower install

WORKDIR /usr/src/app

CMD python main.py
