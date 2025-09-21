import { createSlice } from "@reduxjs/toolkit";
import { ORDER_TYPES } from "../constants";

const initialState = {
    label: "",
    isValueRequired: false,
    defaultValue: "",
    newChoice: "",
    choices: [],
    order: ORDER_TYPES.none,
    errorMsg: "",
};

const orderChoices = (orderType, choices) => {
    switch (orderType) {
        case ORDER_TYPES.ascending:
            choices.sort();
            break;
        case ORDER_TYPES.descending:
            choices.sort().reverse();
            break;
        default:
            break;
    }
}

const formDataSlice = createSlice({
    name: "formData",
    initialState,
    reducers: {
        setInputValue: (state, action) => {
            state[action.payload.inputType] = action.payload.value;
        },
        addChoice: (state, action) => {
            const newChoice = action.payload.trim();
            if (state.choices.includes(newChoice)) state.errorMsg = "Duplicate choices are not allowed.";
            else if (state.choices.count > 50) state.errorMsg = "There cannot be more than 50 choices total.";
            else if (newChoice === "") state.errorMsg = "Cannot add an empty option.";
            else {
                state.choices.push(newChoice);
                orderChoices(state.order, state.choices);
                state.errorMsg = "";
            }
        },
        removeChoice: (state, action) => {
            state.choices = state.choices.filter(choice => choice !== action.payload);
        },
        setOrder: (state, action) => {
            state.order = action.payload;
            orderChoices(action.payload, state.choices);
        },
        resetErrorMsg: (state) => {
            state.errorMsg = "";
        },
        resetFormData: () => initialState,
    },
});

export const { setInputValue, addChoice, removeChoice, setOrder, resetErrorMsg, resetFormData } = formDataSlice.actions;
export default formDataSlice.reducer;
