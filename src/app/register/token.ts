export const storeToken = (token: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('jwt', token);
      document.cookie = `jwt=${token}; path=/; Secure; SameSite=Strict`;
    }
  };
  
  export const getToken = () => {
    if (typeof window !== 'undefined') {
      // From sessionStorage
      try {
        return sessionStorage.getItem('jwt');
      } catch(error) {
        console.error(error)
        return document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
      }
  };
}
  
  export const removeToken = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('jwt');
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };