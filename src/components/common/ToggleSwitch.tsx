import React from 'react'

type Props = {
    isOn: boolean,
    handleToggle: () => void
}

const ToggleSwitch: React.FC<Props> = ({ isOn, handleToggle }) => {
    return (
        <label htmlFor="themeSwitcherTwo" className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
            <input type="checkbox" name="themeSwitcherTwo" id="themeSwitcherTwo" className="sr-only" checked={isOn} onChange={handleToggle} />
            <span className="label flex items-center text-sm font-medium text-black">
                Import
            </span>
            <span className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full bg-main-secondary p-1 duration-200 `}>
                <span className={`dot h-6 w-6 rounded-full bg-neutral-primary duration-200 ${isOn ? 'transform translate-x-full ease-in' : ''}`}></span>
            </span>
            <span className="label flex items-center text-sm font-medium text-black">
                Add
            </span>
        </label>
    );
}

export default ToggleSwitch