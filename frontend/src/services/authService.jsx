import { mockUsers } from "../mockdata/mockUsers"

export async function login({ email, password }) {
  // 🔄 Mantemos mocks por enquanto
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // futuro: await api.post("/login", { email, password })
        resolve({ success: true, user: { email: user.email } });
      } else {
        resolve({ success: false, error: "E-mail ou senha inválidos." });
      }
    }, 500);
  });
}

export async function register(newUser) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const exists = mockUsers.some(
        (u) => u.email === newUser.email || u.username === newUser.username
      );

      if (exists) {
        resolve({ success: false, error: "Usuário ou e-mail já cadastrados." });
      } else {
        mockUsers.push({ ...newUser, password: newUser.password });
        resolve({ success: true, data: newUser });
      }
    }, 500);
  });
}

export async function recoverPassword(email) {
  // futuro: await api.post("/recover-password", { email })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Se este e-mail estiver cadastrado, enviaremos um link de recuperação para ${email}`,
      });
    }, 500);
  });
}

export async function logout() {
  // futuro: await api.post("/logout")
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true }), 200)
  );
}
