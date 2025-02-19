import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api.js";

export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}, thunkAPI) => {
    try {
      const response = await api.post('auth/login', {email, password}, {withCredentials: true});
      return response.data; // Возвращаем данные, если нужно (например, токен)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ?? 'Ошибка авторизации'
      );
    }
  }
);
export const getUser = createAsyncThunk(
  "users/me",
  async (_, thunkAPI) => {
    try {
      const response = await api.get('users/me', {withCredentials: true});
      // console.log("getUser response:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || "User loading error");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await api.get('auth/logout', {withCredentials: true});
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || "User logout error");
    }

  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(login.fulfilled, (state) => {
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(login.rejected, (state, action) => {
      state.error = action.payload;
    })
    .addCase(getUser.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(logout.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default authSlice.reducer;

