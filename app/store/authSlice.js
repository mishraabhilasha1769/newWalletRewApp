import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { signupService } from '../services/signupService';

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ identifier, password }, thunkAPI) => {
    const res = await authService.login(identifier, password);
    if (res.success) return res.user;
    return thunkAPI.rejectWithValue(res.error);
  }
);

// SIGNUP
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ username, email, password, phoneNumber }, thunkAPI) => {
    const userData = {
      username: username,
      phoneNumber: phoneNumber
    };
    const res = await signupService.signup(email, password, userData);
    if (res.success) return res.user;
    return thunkAPI.rejectWithValue(res.error);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
