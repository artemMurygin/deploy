import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user.slice.ts'
import { useDispatch, useSelector } from 'react-redux';


export const store = configureStore({
    reducer: {
        userState: userReducer
    }
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()