#!/usr/bin/env sh
git clone https://github.com/NemTam/realworld-django-rest-framework-angular.git managed/app
if [ -d "managed/app" ]; then
  cd managed/app
  docker compose up -d
else
  echo "Fatal: managed/app directory not found."
fi
