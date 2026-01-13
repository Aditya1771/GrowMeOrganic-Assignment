import React, { useState, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

interface SelectionProps {
    onSelect: (num: number) => void;
}

const CustomSelection: React.FC<SelectionProps> = ({ onSelect }) => {
    const [inputValue, setInputValue] = useState<number | null>(null);
    const op = useRef<OverlayPanel>(null);

    const handleSubmit = () => {
        if (inputValue !== null && inputValue > 0) {
            onSelect(inputValue);
            op.current?.hide();
        }
    };

    return (
        <div className="inline-flex items-center">
            <Button 
                type="button" 
                icon="pi pi-chevron-down" 
                onClick={(e) => op.current?.toggle(e)} 
                className="p-button-text p-button-sm p-0 w-8 h-8 text-gray-400"
            />
            <OverlayPanel ref={op} className="shadow-lg border border-gray-200">
                <div className="flex flex-col gap-3 p-2">
                    <InputNumber 
                        value={inputValue} 
                        onValueChange={(e) => setInputValue(e.value ?? null)} 
                        placeholder="Select rows..." 
                        className="w-full"
                        autoFocus
                    />
                    <Button 
                        label="Submit" 
                        onClick={handleSubmit} 
                        size="small" 
                        severity="secondary"
                        className="w-full"
                    />
                </div>
            </OverlayPanel>
        </div>
    );
};

export default CustomSelection;