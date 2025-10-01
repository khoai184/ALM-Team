import keycloak from "./keycloak";

let isInitialized = false;

const initKeycloak = (onAuthenticatedCallback: Function, _logout: Function) => {
  if (isInitialized) {
    console.log("Keycloak is already initialized.");
    return;
  }

  keycloak
    .init({
      onLoad: "check-sso",
      enableLogging: true,
      pkceMethod: "S256",
      // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'

    })
    .then((authenticated: boolean) => {
      // Do not force logout on unauthenticated; just remain on public routes
      if (authenticated) {
        localStorage.setItem("auth_token", keycloak.token || "");
      }
      isInitialized = true;
      onAuthenticatedCallback();
    })
    .catch((err) => {
      console.error("Keycloak init failed:", err);
    });
};

const getKeyCloack = () => keycloak;

const doLogin = () => keycloak.login({
  redirectUri: window.location.origin + "/",
}); // đăng nhập

const doLogout = () => keycloak.logout({
  redirectUri: window.location.origin + "/login",
}); // đăng xuất

const getToken = () => keycloak.token; // lấy token

const isLoggedIn = () => keycloak.authenticated; // kiểm tra trạng thái đăng nhập

const getUsername = () => keycloak.tokenParsed?.realm_access; // lấy thông tin user

//const hasRole = (roles: string[]) => roles.some((role: string) => keycloak.hasRealmRole(role)); // kiểm tra quyền

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getUsername,
  //hasRole,
  getKeyCloack,
};

export default UserService;
