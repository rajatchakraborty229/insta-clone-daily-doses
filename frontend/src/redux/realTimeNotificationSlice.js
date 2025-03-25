import { createSlice } from "@reduxjs/toolkit";

const realTimeNotifySlice = createSlice({
    name: 'realTimeNotify',
    initialState: {
        likeNotification: [],
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (action.payload.type == 'like') {
                state.likeNotification.push(action.payload)
            } else if (action.payload.type == 'dislike') {
                state.likeNotification = state.likeNotification.filter((item) => item.userId != action.payload.userId)
            }
        }
    }
})

export const { setLikeNotification } = realTimeNotifySlice.actions;
export default realTimeNotifySlice.reducer;
