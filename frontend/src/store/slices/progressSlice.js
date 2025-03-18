import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Имитация API сервиса
const progressService = {
  // Получение данных о прогрессе пользователя
  getProgressData: async () => {
    // Симуляция задержки сети
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Фейковые данные
    return {
      quit_date: new Date('2023-12-01').toISOString(),
      days_without_smoking: 120,
      cigarettes_not_smoked: 2400,
      money_saved: 24000,
      time_saved: 240,
      health_improvements: [
        { id: 1, title: 'Нормализация пульса', achieved: true },
        { id: 2, title: 'Улучшение кровообращения', achieved: true },
        { id: 3, title: 'Восстановление обоняния', achieved: true },
        { id: 4, title: 'Снижение риска инфаркта', achieved: false }
      ],
      progress_milestones: []
    };
  },
  
  // Логирование тяги
  logCraving: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Тяга успешно записана',
      newAchievements: []
    };
  },
  
  // Установка даты отказа от курения
  setQuitDate: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      message: 'Дата отказа от курения установлена',
      data: {
        quit_date: data.quit_date,
        cigarettes_per_day: data.cigarettes_per_day,
        price_per_pack: data.price_per_pack
      }
    };
  },
  
  // Логирование текущего состояния
  logCurrentState: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      message: 'Состояние успешно записано',
      milestone: data.is_milestone ? {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        title: data.title || 'Новая веха достигнута',
        description: data.description || '',
        mood: data.mood
      } : null
    };
  }
};

// Асинхронный thunk для получения данных о прогрессе
export const fetchProgressData = createAsyncThunk(
  'progress/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await progressService.getProgressData();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка получения данных о прогрессе');
    }
  }
);

// Асинхронный thunk для логирования тяги
export const logCraving = createAsyncThunk(
  'progress/logCraving',
  async (data, { rejectWithValue }) => {
    try {
      const response = await progressService.logCraving(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка при сохранении данных о тяге');
    }
  }
);

// Асинхронный thunk для установки даты отказа от курения
export const setQuitDate = createAsyncThunk(
  'progress/setQuitDate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await progressService.setQuitDate(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка при установке даты отказа от курения');
    }
  }
);

// Асинхронный thunk для логирования текущего состояния
export const logCurrentState = createAsyncThunk(
  'progress/logCurrentState',
  async (data, { rejectWithValue }) => {
    try {
      const response = await progressService.logCurrentState(data);
      return {
        state: data,
        milestone: response.milestone
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка при сохранении текущего состояния');
    }
  }
);

// Начальное состояние
const initialState = {
  data: null,
  milestones: [],
  cravings: [],
  isLoading: false,
  error: null,
  success: null
};

// Создание slice
const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearProgressError: (state) => {
      state.error = null;
    },
    clearProgressSuccess: (state) => {
      state.success = null;
    },
    clearProgressMessages: (state) => {
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка загрузки данных о прогрессе
      .addCase(fetchProgressData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProgressData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProgressData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Обработка логирования тяги
      .addCase(logCraving.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(logCraving.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Тяга успешно записана';
        
        // Добавляем запись о тяге в массив
        state.cravings.push({
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...action.meta.arg // Добавляем данные о тяге из аргументов
        });
      })
      .addCase(logCraving.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Обработка установки даты отказа от курения
      .addCase(setQuitDate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(setQuitDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Дата отказа от курения установлена';
        
        if (!state.data) {
          state.data = {};
        }
        
        // Обновляем данные о дате отказа
        state.data.quit_date = action.payload.quit_date;
        state.data.cigarettes_per_day = action.payload.cigarettes_per_day;
        state.data.price_per_pack = action.payload.price_per_pack;
      })
      .addCase(setQuitDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Обработка логирования текущего состояния
      .addCase(logCurrentState.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(logCurrentState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Состояние успешно записано';
        
        // Добавляем веху, если она была создана
        if (action.payload.milestone) {
          state.milestones.push(action.payload.milestone);
        }
      })
      .addCase(logCurrentState.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Экспорт actions
export const { 
  clearProgressError,
  clearProgressSuccess,
  clearProgressMessages
} = progressSlice.actions;

// Экспорт selectors
export const selectProgressData = (state) => state.progress.data;
export const selectProgressMilestones = (state) => state.progress.milestones;
export const selectProgressCravings = (state) => state.progress.cravings;
export const selectProgressLoading = (state) => state.progress.isLoading;
export const selectProgressError = (state) => state.progress.error;
export const selectProgressSuccess = (state) => state.progress.success;

// Экспорт reducer
export default progressSlice.reducer; 