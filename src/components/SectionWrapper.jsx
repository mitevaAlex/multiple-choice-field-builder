function SectionWrapper({ additionalStyles, children }) {
    return (
        <div className={`flex w-full items-center justify-between ${additionalStyles}`}>
            {children}
        </div>
    );
}

export default SectionWrapper;