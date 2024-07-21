
# Intranetrco

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.1.

Le projet a été creer comme suit :

- installer Volta : https://docs.volta.sh/guide/getting-started Volta est un utilitaire qui permet de switcher de version de node automatiquement en fonction du projet sur lequel vous êtes.

-   intallser Node et angular cli par volta :
```
    volta install node@20.11.0
    volta install @angular/cli@latest
```
- Generation du projet 
```
    ng new intranetrco --routing --skip-tests
```
- Generate SSL certs (vial WSL ubuntu si Windows)
```
    openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
    ------------------------------------------
    Country Name (2 letter code) [AU]:GP
    State or Province Name (full name) [Some-State]:France
    Locality Name (eg, city) []:Paris
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:RCO
    Organizational Unit Name (eg, section) []:RCO
    Common Name (e.g. server FQDN or YOUR name) []:https://localhost
    Email Address []:lary.sene@gmail.com
```
- Update package.json
```
    "start": "ng serve --ssl --ssl-key key.pem --ssl-cert cert.pem"
```

    npm install @fontsource/roboto  
    ng add @angular/material
    npm install ag-grid-angular   https://www.ag-grid.com/angular-data-grid/getting-started/
    https://angular-material.dev/articles/angular-material-3

    generate theme ng generate @angular/material:m3-theme

    https://themes.angular-material.dev/
    

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.