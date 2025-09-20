import TextInput from "./components/TextInput";
import SectionWrapper from "./components/SectionWrapper";
import { INPUT_TYPES, ORDER_OPTIONS } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { addChoice, removeChoice, resetErrorMsg, resetFormData, setInputValue, setOrder } from "./store/formDataSlice";

function App() {
    const label = useSelector((state) => state.formDataSlice.label);
    const isValueRequired = useSelector((state) => state.formDataSlice.isValueRequired);
    const defaultValue = useSelector((state) => state.formDataSlice.defaultValue);
    const newChoice = useSelector((state) => state.formDataSlice.newChoice);
    const choices = useSelector((state) => state.formDataSlice.choices);
    const order = useSelector((state) => state.formDataSlice.order);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <form onSubmit={(e) => { handleSubmit(e) }}>
            <div className="max-w-md h-fit my-10 mx-auto border border-[#c4ebf3] rounded-md bg-white overflow-hidden">
                <h2 className="px-5 py-2.5 bg-[#d9eef7] text-[#1f6d93] font-bold border border-[#c4ebf3]">
                    Field Builder
                </h2>

                <div className="flex flex-col w-full h-fit p-5">

                    <TextInput value={label} labelText="Label" inputId={INPUT_TYPES.label} required placeholder="e.g. Sales Region" />

                    <SectionWrapper additionalStyles="mb-7.5">
                        <label>Type</label>
                        <strong>Multi-select</strong>

                        <label className="mx-2.5 flex items-center justify-center">
                            <input
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
                        <h3>Choices</h3>
                        <div className="w-64 min-h-[33.6px] border border-[#cccccc] rounded-sm overflow-hidden">
                            {choices.map((choice, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-3 py-1 hover:bg-gray-100 group"
                                >
                                    <span>{choice}</span>
                                    <button
                                        type="button"
                                        onClick={() => { console.log(choice); dispatch(removeChoice(choice)) }}
                                        className="hidden group-hover:inline cursor-pointer text-gray-500 hover:text-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </SectionWrapper>

                    <SectionWrapper additionalStyles="mb-7.5">
                        <label htmlFor="order">Order</label>
                        <select
                            id={INPUT_TYPES.order}
                            name={INPUT_TYPES.order}
                            defaultValue={order}
                            className="max-w-2xs px-3 leading-8 border border-[#cccccc] rounded-sm"
                            onChange={(e) => { dispatch(setOrder(e.target.value)); }}
                        >
                            {ORDER_OPTIONS.map((option, index) => (
                                <option key={index} value={option.value}>{option.text}</option>
                            ))}
                        </select>
                    </SectionWrapper>

                    <SectionWrapper additionalStyles="mt-2.5 mb-5 justify-center">
                        <button type="submit" className="px-4 py-1 ml-4 bg-[#5bb85b] text-white font-medium rounded-sm cursor-pointer">Save shanges</button>
                        <span className="mx-5">Or</span>
                        <button type="reset" className="text-red-600 font-medium cursor-pointer" onClick={() => dispatch(resetFormData())}>Cancel</button>
                    </SectionWrapper>
                </div>
            </div>
        </ form>
    );
}

export default App;
