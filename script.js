// DOM Elements
const form = document.getElementById("form");
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.getElementById("toggleText");
const welcomeTitle = document.querySelector(".welcome-text h2");
const welcomeSubtitle = document.querySelector(".welcome-text p");
const submitBtn = document.getElementById("submitBtn");
const toast = document.getElementById("toast");

// Form fields
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const rememberMe = document.getElementById("rememberMe");

// Password strength elements
const passwordStrength = document.getElementById("passwordStrength");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

// Modal elements
const forgotPassword = document.getElementById("forgotPassword");
const forgotModal = document.getElementById("forgotModal");
const closeModal = document.getElementById("closeModal");
const forgotForm = document.getElementById("forgotForm");
const resetEmail = document.getElementById("resetEmail");

// Social login buttons
const googleLogin = document.getElementById("googleLogin");
const githubLogin = document.getElementById("githubLogin");

// State management
let isLogin = true;
let isSubmitting = false;

// Session management
class SessionManager {
  constructor() {
    this.sessionKey = 'secureAuth_session';
    this.userKey = 'secureAuth_user';
  }

  // Check if user is logged in
  isLoggedIn() {
    const session = this.getSession();
    if (!session) return false;
    
    // Check if session is expired
    if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
      this.logout();
      return false;
    }
    
    return true;
  }

  // Get current session
  getSession() {
    const session = localStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : null;
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Create session
  login(userData, rememberMe = false) {
    const session = {
      token: this.generateToken(),
      expiresAt: rememberMe ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : // 30 days
        new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    localStorage.setItem(this.userKey, JSON.stringify(userData));
    
    return session;
  }

  // Logout
  logout() {
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.userKey);
  }

  // Generate simple token (in real app, this would be from server)
  generateToken() {
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}

// Validation utilities
class Validator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push('One uppercase letter');
    if (!hasLowerCase) errors.push('One lowercase letter');
    if (!hasNumbers) errors.push('One number');
    if (!hasSpecialChar) errors.push('One special character');

    return {
      isValid: errors.length === 0,
      errors,
      score: this.calculatePasswordStrength(password)
    };
  }

  static calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    if (password.length >= 12) score += 1;

    return Math.min(score, 5);
  }

  static getStrengthText(score) {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  }

  static getStrengthClass(score) {
    if (score <= 1) return 'weak';
    if (score <= 2) return 'fair';
    if (score <= 3) return 'good';
    return 'strong';
  }
}

// Toast notification system
class Toast {
  static show(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    const messageEl = toast.querySelector('.toast-message');
    
    // Remove existing classes
    toast.className = 'toast';
    
    // Add type class
    toast.classList.add(type);
    
    // Set message
    messageEl.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
}

// Password strength indicator
function updatePasswordStrength(password) {
  if (!password) {
    passwordStrength.style.display = 'none';
    return;
  }

  const score = Validator.calculatePasswordStrength(password);
  const strengthClass = Validator.getStrengthClass(score);
  const strengthText = Validator.getStrengthText(score);

  strengthFill.className = `strength-fill ${strengthClass}`;
  strengthText.textContent = strengthText;
  passwordStrength.style.display = 'block';
}

// Toggle password visibility
function setupPasswordToggles() {
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

  togglePassword.addEventListener("click", () => {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });

  toggleConfirmPassword.addEventListener("click", () => {
    const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
    confirmPassword.setAttribute("type", type);
    toggleConfirmPassword.classList.toggle("fa-eye");
    toggleConfirmPassword.classList.toggle("fa-eye-slash");
  });
}

// Form toggle between login and signup
function toggleForm() {
  isLogin = !isLogin;
  
  welcomeTitle.textContent = isLogin ? "Welcome Back" : "Create Account";
  welcomeSubtitle.textContent = isLogin ? 
    "Sign in to your account to continue" : 
    "Join us and start your journey";
  
  email.style.display = isLogin ? "none" : "block";
  confirmPassword.style.display = isLogin ? "none" : "block";
  
  toggleText.innerHTML = isLogin
    ? 'Don\'t have an account? <a href="#" id="toggleLink">Sign Up</a>'
    : 'Already have an account? <a href="#" id="toggleLink">Sign In</a>';
  
  submitBtn.querySelector('.btn-text').textContent = isLogin ? "Sign In" : "Sign Up";
  
  // Clear form
  form.reset();
  clearErrors();
  
  // Reset password strength indicator
  updatePasswordStrength('');
}

// Clear all error messages
function clearErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(error => {
    error.textContent = '';
    error.classList.remove('show');
  });
}

// Show error message
function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

// Clear error message
function clearError(fieldId) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}

// Simulate API call
async function simulateApiCall(data, endpoint) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate different scenarios
      if (endpoint === 'login') {
        if (data.username === 'demo' && data.password === 'password123') {
          resolve({
            success: true,
            user: {
              id: 1,
              username: 'demo',
              email: 'demo@example.com',
              name: 'Demo User'
            }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      } else if (endpoint === 'register') {
        resolve({
          success: true,
          user: {
            id: Date.now(),
            username: data.username,
            email: data.email,
            name: data.username
          }
        });
      } else if (endpoint === 'reset-password') {
        resolve({
          success: true,
          message: 'Password reset link sent to your email'
        });
      }
    }, 1500); // Simulate network delay
  });
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  if (isSubmitting) return;
  
  clearErrors();
  
  const formData = {
    username: username.value.trim(),
    email: email.value.trim(),
    password: password.value.trim(),
    confirmPassword: confirmPassword.value.trim()
  };
  
  // Validation
  let isValid = true;
  
  if (!formData.username) {
    showError('username', 'Username is required');
    isValid = false;
  }
  
  if (!isLogin && !formData.email) {
    showError('email', 'Email is required');
    isValid = false;
  } else if (!isLogin && !Validator.validateEmail(formData.email)) {
    showError('email', 'Please enter a valid email');
    isValid = false;
  }
  
  if (!formData.password) {
    showError('password', 'Password is required');
    isValid = false;
  } else if (!isLogin) {
    const passwordValidation = Validator.validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      showError('password', passwordValidation.errors.join(', '));
      isValid = false;
    }
  }
  
  if (!isLogin && formData.password !== formData.confirmPassword) {
    showError('confirmPassword', 'Passwords do not match');
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Show loading state
  isSubmitting = true;
  submitBtn.classList.add('loading');
  
  try {
    const endpoint = isLogin ? 'login' : 'register';
    const response = await simulateApiCall(formData, endpoint);
    
    if (response.success) {
      // Create session
      const sessionManager = new SessionManager();
      sessionManager.login(response.user, rememberMe.checked);
      
      Toast.show(
        isLogin ? 'Login successful!' : 'Account created successfully!',
        'success'
      );
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    }
  } catch (error) {
    Toast.show(error.message, 'error');
  } finally {
    isSubmitting = false;
    submitBtn.classList.remove('loading');
  }
}

// Handle forgot password
async function handleForgotPassword(e) {
  e.preventDefault();
  
  const email = resetEmail.value.trim();
  
  if (!email) {
    Toast.show('Please enter your email address', 'warning');
    return;
  }
  
  if (!Validator.validateEmail(email)) {
    Toast.show('Please enter a valid email address', 'warning');
    return;
  }
  
  const resetBtn = forgotForm.querySelector('.reset-btn');
  resetBtn.classList.add('loading');
  
  try {
    const response = await simulateApiCall({ email }, 'reset-password');
    Toast.show(response.message, 'success');
    closeForgotModal();
  } catch (error) {
    Toast.show('Failed to send reset link. Please try again.', 'error');
  } finally {
    resetBtn.classList.remove('loading');
  }
}

// Modal functions
function openForgotModal() {
  forgotModal.classList.add('show');
  resetEmail.focus();
}

function closeForgotModal() {
  forgotModal.classList.remove('show');
  forgotForm.reset();
}

// Social login handlers
function handleSocialLogin(provider) {
  Toast.show(`Redirecting to ${provider}...`, 'warning');
  // In a real app, this would redirect to OAuth provider
  setTimeout(() => {
    Toast.show(`${provider} login not implemented in demo`, 'warning');
  }, 2000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  const sessionManager = new SessionManager();
  if (sessionManager.isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }
  
  // Setup password toggles
  setupPasswordToggles();
  
  // Form toggle - use event delegation since the link gets recreated
  document.addEventListener("click", (e) => {
    if (e.target.id === "toggleLink") {
      e.preventDefault();
      toggleForm();
    }
  });
  
  // Form submission
  form.addEventListener("submit", handleSubmit);
  
  // Password strength
  password.addEventListener("input", (e) => {
    updatePasswordStrength(e.target.value);
    clearError('password');
  });
  
  // Real-time validation
  username.addEventListener("blur", () => {
    if (username.value.trim() && username.value.trim().length < 3) {
      showError('username', 'Username must be at least 3 characters');
    }
  });
  
  email.addEventListener("blur", () => {
    if (email.value.trim() && !Validator.validateEmail(email.value.trim())) {
      showError('email', 'Please enter a valid email');
    }
  });
  
  // Clear errors on input
  username.addEventListener("input", () => clearError('username'));
  email.addEventListener("input", () => clearError('email'));
  confirmPassword.addEventListener("input", () => clearError('confirmPassword'));
  
  // Forgot password modal
  forgotPassword.addEventListener("click", (e) => {
    e.preventDefault();
    openForgotModal();
  });
  
  closeModal.addEventListener("click", closeForgotModal);
  forgotModal.addEventListener("click", (e) => {
    if (e.target === forgotModal) {
      closeForgotModal();
    }
  });
  
  forgotForm.addEventListener("submit", handleForgotPassword);
  
  // Social login
  googleLogin.addEventListener("click", () => handleSocialLogin('Google'));
  githubLogin.addEventListener("click", () => handleSocialLogin('GitHub'));
  
  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeForgotModal();
    }
  });
});