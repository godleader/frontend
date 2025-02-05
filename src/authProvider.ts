import { AuthProvider } from "@refinedev/core";

export const TOKEN_KEY = "zeal-auth";

const backend = import.meta.env.VITE_BACKEND_SERVER

export const authProvider: AuthProvider = {
   login: async ({ email, password }) => {
      const response = await fetch(`${backend}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });
   if (response.ok) {
      const data = await response.json();
      // Use sessionStorage instead of localStorage
      sessionStorage.setItem("token", data.token);
      return {
        success: true,
        redirectTo: "/",
      };
    } else {
      return {
        success: false,
        error: { message: "Login failed", name: "InvalidCredentials" },
      };
    }
  },
  logout: async () => {
    sessionStorage.removeItem("token");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
   // Check if the user is authenticated
   check: async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      error: {
        message: "No token found",
        name: "TokenMissing",
      },
      logout: true,
      redirectTo: "/login",
    };
  },

   getPermissions: async () => null,
   getIdentity: async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
         const base64Url = token.split(".")[1];
         const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
         const jsonPayload = decodeURIComponent(
            atob(base64)
               .split("")
               .map(function (c) {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
               })
               .join("")
         );

         const { email, username, role } = JSON.parse(jsonPayload);

         return {
            id: 1,
            name: username,
            email: email,
            role: role,
            avatar: "https://i.pravatar.cc/300",
         };
      }
      return null;
   },
   onError: async (error) => {
      if (error.status === 401 || error.status === 403) {
         return {
            logout: true,
            redirectTo: "/login",
            error,
         };
      }
      console.error(error);
      return { error };
   },
   updatePassword: async ({ password, confirmPassword, token }) => {
      //update the user's password here

      // if the password was updated successfully
      return {
         success: true,
         redirectTo: "/login",
      };

      // if the password update failed
      return {
         success: false,
         error: {
            message: "Password update failed",
            name: "Password update failed",
         },
      };
   },
   forgotPassword: async ({ email }) => {
      // send password reset link to the user's email address here

      // if request is successful
      return {
         success: true,
         redirectTo: "/login",
      };

      // if request is not successful
      return {
         success: false,
         error: {
            name: "Forgot Password Error",
            message: "Email address does not exist",
         },
      };
   },


     // Registration: call the backend /api/users/register endpoint
     register: async ({ username, email, password, role }) => {
      const response = await fetch(`${backend}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (response.status === 201) {
          // Successful registration redirects to login
          return {
              success: true,
              redirectTo: "/login",
          };
      } else if (response.status === 400) {
          return {
              success: false,
              error: {
                  name: "Register Error",
                  message: data.message || "User already exists",
              },
          };
      } else {
          return {
              success: false,
              error: {
                  name: "Register Error",
                  message: data.message || "An error occurred",
              },
          };
      }
  },
};
