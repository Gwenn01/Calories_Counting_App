let authEnabled = true;

export const disableAuth = () => {
  authEnabled = false;
};

export const enableAuth = () => {
  authEnabled = true;
};

export const isAuthEnabled = () => authEnabled;
