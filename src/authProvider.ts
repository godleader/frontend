import { AuthProvider } from "@refinedev/core";

export const TOKEN_KEY = "zeal-auth";

const backend = import.meta.env.VITE_BACKEND_SERVER;

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${backend}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem(TOKEN_KEY, data.token);
        return {
          success: true,
          redirectTo: "/search",
        };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            message: errorData.message || "Login failed",
            name: "InvalidCredentials",
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Network error. Please try again.",
          name: "NetworkError",
        },
      };
    }
  },

  logout: async () => {
    sessionStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
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
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const { email, username, role, walletBalance } = JSON.parse(jsonPayload);

        return {
          id: 1,
          name: username,
          email: email,
          role: role,
          walletBalance: walletBalance,
          avatar: "https://i.pravatar.cc/300",
        };
      } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
      }
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
    try {
      const response = await fetch(`${backend}/api/users/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password, confirmPassword }),
      });

      if (response.ok) {
        return {
          success: true,
          redirectTo: "/login",
        };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            message: errorData.message || "Password update failed",
            name: "PasswordUpdateError",
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Network error. Please try again.",
          name: "NetworkError",
        },
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const response = await fetch(`${backend}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        return {
          success: true,
          redirectTo: "/login",
        };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: {
            message: errorData.message || "Email address does not exist",
            name: "ForgotPasswordError",
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Network error. Please try again.",
          name: "NetworkError",
        },
      };
    }
  },

  register: async ({ username, email, password, role }) => {
    try {
      const response = await fetch(`${backend}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (response.status === 201) {
        return {
          success: true,
          redirectTo: "/login",
        };
      } else if (response.status === 400) {
        return {
          success: false,
          error: {
            name: "RegisterError",
            message: data.message || "User already exists",
          },
        };
      } else {
        return {
          success: false,
          error: {
            name: "RegisterError",
            message: data.message || "An error occurred",
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "Network error. Please try again.",
        },
      };
    }
  },
};