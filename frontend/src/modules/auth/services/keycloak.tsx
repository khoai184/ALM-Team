import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://id.dev.codegym.vn/auth", 
  realm: "codegym-software-nhom-4",                         
  clientId: "codegym-tim-frontend",                  
});

export default keycloak;