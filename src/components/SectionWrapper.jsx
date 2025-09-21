function SectionWrapper({ additionalStyles, children }) {
    return (
        <div className={`flex flex-wrap w-full items-center justify-between gap-2.5 ${additionalStyles}`}>
            {children}
        </div>
    );
}

export default SectionWrapper;