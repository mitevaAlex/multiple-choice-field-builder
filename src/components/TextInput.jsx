import SectionWrapper from "./SectionWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setInputValue } from "../store/formDataSlice";
import { INPUT_TYPES } from "../constants";

function TextInput({
    labelText,
    inputId,
    value,
    placeholder,
    required,
    buttonFunc,
    buttonText,
}) {
    const dispatch = useDispatch();
    const errorMsg = useSelector((state) => state.formDataSlice.errorMsg);

    return (
        <>
            <SectionWrapper additionalStyles={errorMsg && inputId === INPUT_TYPES.newChoice ? "mb-2" : "mb-7.5"}>
                <label htmlFor={inputId}>{labelText}</label>
                <div className="flex flex-nowrap gap-3">
                    <input
                        id={inputId}
                        name={inputId}
                        required={required}
                        type="text"
                        size={buttonFunc && buttonText ? '19' : '27'}
                        value={value}
                        placeholder={placeholder}
                        className="px-3 leading-8 border border-chinese-silver rounded-sm"
                        onChange={(e) => { dispatch(setInputValue({ inputType: inputId, value: e.target.value })) }}
                    />
                    {buttonFunc
                        && buttonText
                        && <button
                            type="button"
                            className="px-2 py-1 bg-green text-white rounded-sm cursor-pointer"
                            onClick={buttonFunc}>
                            {buttonText}
                        </button>
                    }
                </div>
            </SectionWrapper>
            {errorMsg
                && inputId === INPUT_TYPES.newChoice
                && <p className="text-red-600 mb-3 text-sm">{errorMsg}</p>}
        </>
    )
}

export default TextInput;