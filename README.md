# Artalk
O retea de socializare care vine in ajutorul artistilor ce nu se mai pot promova eficient online din cauza faptului ca toate retelele de socializare incurajeaza doar continutul video, astfel ilustratori, pictori, sculptori, fotografi etc au ramas fara o platforma care sa-i valorizeze. De asemenea, Artalk are si o mica parte de freelancing: fiecare utilizator poate sa-si puna un gig in care descrie experienta pe care o are si in ce domeniu, iar un potential client poate filtra prin toate aceste giguri si poate gasi persoana perfecta cu care poate colabora. Apoi, clientul ii poate scrie artistului in privat despre proiectul la care are nevoie de ajutor.
# Tehnologii folosite
## Front end
- ### [React Native](https://reactnative.dev/)
    React Native e un framework de javascript bazat pe React care are propriile componente de UI care sunt, mai apoi, transformate in componente native platformei pe care ruleaza aplicatia. Astfel, putem scrie codul o data si sa poata rula ca aplicatie de Android, IOS sau ca pagina web.
- ### [Expo](https://expo.dev/)
    Expo este un middleware care ajuta cu buildul unei aplicatii de React/React Native, actualizarea ei in timp de productie si rularea acesteia pe diferite dispozitive in timpul developmentului.
- ### [React Native Async Storage](https://reactnative.dev/docs/asyncstorage)
    Aceasta este o librarie din React Native care permite stocarea de date local. In acest proiect este folosit pentru a stoca id-ul utilizatorului logat sub forma unui token pentru a salva sesiunea.
- ### [React Navigation Drawer](https://reactnavigation.org/docs/drawer-based-navigation/)
    React Navigation Drawer este o librarie de React care se ocupa cu meniul glisant al aplicatiei.
- ### [Expo Linking](https://docs.expo.dev/guides/linking/)
    Expo Linking este o librarie Expo care transforma o aplicatie React Native care by default este SPA, single page application intr-o aplicatie de tip MPA, multi page application care ofera o experienta mult mai naturala si nativa pentru navigarea in browser.
## Back end
- ### [NodeJs](https://nodejs.org/en/)
    NodeJs este un runtime asincron de javascript bazat pe eventuri. Acesta este folosit pentru a realiza partea de server a aplicatiei si pentru a raspunde la requesturile date de client.
- ### [MongoDB](https://www.mongodb.com/)
    MongoDB este un serviciu de host de baze de date non-relationale. Aici sunt stocate toate datele aplicatiei: utilizatori, postari, giguri, relatiile de follow intre useri etc. 
- ### [JWT](https://jwt.io/)
    JWT sau JSON Web Token este un mod criptat si sigur de a transmite date private intre server si client. De exemplu, la log in serverul trimite catre client id-ul utilizatorului criptat cu ajutorul jwt care va fi salvat local sub forma de cookies pentru a tine minte sesiunea clientului.
- ### [BcryptJs](https://www.npmjs.com/package/bcryptjs)
    BcryptJs este o librarie de NodeJs care cripteaza parole folosind hash-uri. Odata ce parola este introdusa la inregistrare sau autentificare, aceasta este criptata si trimisa catre server unde este introdusa in baza de date.
