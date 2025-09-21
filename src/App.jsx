import TextInput from "./components/TextInput";
import SectionWrapper from "./components/SectionWrapper";
import { INPUT_TYPES, ORDER_OPTIONS } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { addChoice, removeChoice, resetErrorMsg, resetFormData, setErrorMsg, setInputValue, setOrder } from "./store/formDataSlice";
import { useState } from "react";

function App() {
    const label = useSelector((state) => state.formDataSlice.label);
    const isValueRequired = useSelector((state) => state.formDataSlice.isValueRequired);
    const defaultValue = useSelector((state) => state.formDataSlice.defaultValue);
    const newChoice = useSelector((state) => state.formDataSlice.newChoice);
    const choices = useSelector((state) => state.formDataSlice.choices);
    const order = useSelector((state) => state.formDataSlice.order);

    const [selectedChoice, setSelectedChoice] = useState("");

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(choices.length === 0) {
            dispatch(setErrorMsg("Cannot have 0 choices."));
            return;
        }
        (!choices.includes(defaultValue) && defaultValue !== '') && dispatch(addChoice(defaultValue));
        dispatch(resetErrorMsg());
        try {
            const body = {
                label,
                isValueRequired,
                defaultValue,
                choices
            };
            const response = await fetch("https://multiple-choice-field-builder.free.beeceptor.com/form/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            console.log("POST request body: ", body);

            const data = await response.json();
            console.log("Response body:", data);

            if (!response.ok) {
                alert("Failed to submit form!");
            } else {
                alert("Changes saved!");
            }
        } catch (error) {
            alert("Error submitting form: " + error.message);
        }
    };

    return (
        <form method="post" onSubmit={(e) => { handleSubmit(e) }}>
            <div className="max-w-md h-fit my-10 mx-5 sm:mx-auto border border-diamond rounded-md bg-white overflow-hidden">
                <h2 className="px-5 py-2.5 bg-azureish-white text-lapis-lazuli font-bold border border-diamond">
                    Field Builder
                </h2>

                <div className="flex flex-col justify-center w-full h-fit p-6 sm:p-7.5">

                    <TextInput value={label} labelText="Label" inputId={INPUT_TYPES.label} required placeholder="e.g. Sales Region" />

                    <SectionWrapper additionalStyles="mb-7.5">
                        <div className="flex gap-2.5">
                            <p>Type</p>
                            <strong>Multi-select</strong>
                        </div>

                        <label className="flex items-center justify-center">
                            <input
                                id={INPUT_TYPES.isValueRequired}
                                name={INPUT_TYPES.isValueRequired}
                                type="checkbox"
                                checked={isValueRequired}
                                className="mx-2.5 w-4 h-4"
                                onChange={(e) => dispatch(setInputValue({ inputType: INPUT_TYPES.isValueRequired, value: e.target.checked }))}
                            />
                            A Value is required
                        </label>
                    </SectionWrapper>
                    <TextInput value={defaultValue} labelText="Default Value" inputId={INPUT_TYPES.defaultValue} placeholder="e.g. Asia" />

                    <TextInput
                        value={newChoice}
                        labelText="Add a Choice"
                        inputId={INPUT_TYPES.newChoice}
                        placeholder="e.g. Australia"
                        buttonFunc={() => { dispatch(addChoice(newChoice)) }}
                        buttonText="Add"
                    />

                    <SectionWrapper additionalStyles="mb-7.5 items-start">
                        <p>Choices</p>
                        <div className="w-64 min-h-[33.6px] border border-chinese-silver rounded-sm overflow-hidden cursor-pointer">
                            {choices.map((choice, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedChoice(choice)}
                                    className={
                                        `flex relative items-center justify-between px-3 py-1 hover:bg-anti-flash-white group 
                                        ${selectedChoice === choice && 'bg-anti-flash-white'}`
                                    }
                                >
                                    <span>{choice}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedChoice("");
                                            dispatch(removeChoice(choice))
                                        }}
                                        className={
                                            `hidden absolute group-hover:inline right-3 top-1 cursor-pointer 
                                            text-auro-metal hover:text-red ${selectedChoice === choice && 'inline'}`}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </SectionWrapper>

                    <SectionWrapper additionalStyles="mb-7.5">
                        <label htmlFor={INPUT_TYPES.order}>Order</label>
                        <select
                            id={INPUT_TYPES.order}
                            name={INPUT_TYPES.order}
                            defaultValue={order}
                            className="w-64 h-[33.6px] px-3 leading-8 border border-chinese-silver rounded-sm"
                            onChange={(e) => { dispatch(setOrder(e.target.value)); }}
                        >
                            {ORDER_OPTIONS.map((option, index) => (
                                <option key={index} value={option.value}>{option.text}</option>
                            ))}
                        </select>
                    </SectionWrapper>

                    <SectionWrapper additionalStyles="mt-2.5 mb-5 justify-center">
                        <button type="submit" className="px-4 py-1 ml-4 bg-green text-white font-medium rounded-sm cursor-pointer">Save shanges</button>
                        <span>Or</span>
                        <button type="reset" className="text-red font-medium cursor-pointer" onClick={() => dispatch(resetFormData())}>Cancel</button>
                    </SectionWrapper>
                </div>
            </div>
        </ form>
    );
}

export default App;
