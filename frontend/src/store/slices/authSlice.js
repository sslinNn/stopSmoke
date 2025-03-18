import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import { AUTH_STORAGE_KEY } from '../../constants/auth';

// Функция для загрузки начального состояния из localStorage
function loadAuthState() {
  try {
    const serializedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

// Функция для сохранения состояния в localStorage
function saveAuthState(state) {
  try {
    const serializedState = JSON.stringify({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    });
    localStorage.setItem(AUTH_STORAGE_KEY, serializedState);
  } catch (err) {
    // Игнорируем ошибки записи
  }
}

// Асинхронный thunk для регистрации
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка регистрации');
    }
  }
);

// Асинхронный thunk для входа
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка входа');
    }
  }
);

// Асинхронный thunk для выхода
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Немедленно очищаем localStorage, чтобы предотвратить лишние запросы
      localStorage.removeItem(AUTH_STORAGE_KEY);
      
      // Делаем запрос к API для выхода
      await authService.logout();
      
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка выхода');
    }
  }
);

// Асинхронный thunk для получения текущего пользователя
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.user_data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка получения данных пользователя');
    }
  }
);

// Начальное состояние
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  ...loadAuthState(), // Загружаем сохраненное состояние
};

// Создание slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка регистрации
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        saveAuthState(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Обработка входа
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        saveAuthState(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Обработка выхода
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Обработка получения текущего пользователя
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        saveAuthState(state);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem(AUTH_STORAGE_KEY);
      });
  },
});

// Экспорт действий
export const { clearError } = authSlice.actions;

// Экспорт селекторов
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

// Экспорт редьюсера
export default authSlice.reducer; 