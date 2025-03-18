import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../../services/userService';
import { fetchCurrentUser } from './authSlice';
import { updateAvatarVersion } from '../../constants/auth';

// Асинхронный thunk для получения профиля пользователя
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка получения профиля');
    }
  }
);

// Асинхронный thunk для обновления профиля пользователя
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserProfile(profileData);
      return response.user_data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка обновления профиля');
    }
  }
);



// Асинхронный thunk для обновления аватара пользователя
export const updateUserAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await userService.uploadAvatar(formData);
      
      // Обновляем версию аватара для сброса кэша
      updateAvatarVersion();
      
      // После успешного обновления аватара, обновляем данные пользователя
      dispatch(fetchCurrentUser());
      
      return response.avatar_data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления аватара');
    }
  }
);

// Начальное состояние
const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  success: null,
};

// Создание slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Сброс ошибок
    clearUserError: (state) => {
      state.error = null;
    },
    // Сброс данных пользователя (например, при выходе)
    resetUserData: (state) => {
      state.profile = null;
      state.error = null;
      state.success = null;
    },
    clearUserMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка получения профиля
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Обработка обновления профиля
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.success = 'Профиль успешно обновлен';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      
      // Обработка обновления аватара
      .addCase(updateUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.avatar_url = action.payload;
        }
        state.success = 'Аватар успешно обновлен';
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Экспорт действий
export const { clearUserError, resetUserData, clearUserMessages } = userSlice.actions;

// Экспорт селекторов
export const selectUserProfile = (state) => state.user.profile;
export const selectUserFriends = (state) => state.user.friends;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectUserSuccess = (state) => state.user.success;

// Экспорт редьюсера
export default userSlice.reducer; 