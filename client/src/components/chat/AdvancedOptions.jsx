import React from 'react';

export default function AdvancedOptions({ settings, setSettings }) {
    return (
        <div className='bg-gray-100 p-4 rounded-lg shadow'>
            {/* <h2 className='text-xl font-semibold mb-4'>Advanced Settings</h2> */}

            <div className='grid grid-cols-1 md:grid-cols-1 gap-8'>
                <ModelSelect model={settings?.model} setSettings={setSettings} models={settings?.models} />
                <SliderControl
                    id='temperature'
                    label='Temperature'
                    value={settings?.temperature}
                    min={0}
                    max={2}
                    step={0.01}
                    updateSettings={setSettings}
                />
                <SliderControl
                    id='maxLength'
                    label='Maximum Length'
                    value={settings?.maxLength}
                    min={1}
                    max={4096}
                    step={1}
                    updateSettings={setSettings}
                />
                <SliderControl
                    id='topP'
                    label='Top P'
                    value={settings?.topP}
                    min={0}
                    max={1}
                    step={0.01}
                    updateSettings={setSettings}
                />
                <SliderControl
                    id='frequencyPenalty'
                    label='Frequency Penalty'
                    value={settings?.frequencyPenalty}
                    updateSettings={setSettings}
                    min={0}
                    max={2}
                    step={0.01}
                />
                <SliderControl
                    id='presencePenalty'
                    label='Presence Penalty'
                    value={settings?.presencePenalty}
                    updateSettings={setSettings}
                    min={0}
                    max={2}
                    step={0.01}
                />
            </div>
        </div>
    );
}

function ModelSelect({ model, setSettings, models }) {
    return (
        <div>
            <label htmlFor='model' className='block text-sm font-medium text-gray-700'>
                Model
            </label>
            <select
                id='model'
                defaultValue={model}
                onChange={(e) => {
                    setSettings((prev) => ({ ...prev, model: e.target.value }));
                    console.log(e.target.value);
                }}
                className='mt-1 block w-full -3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500'
            >
                {models.map((model) => (
                    <option key={model.modelId} value={model.modelId} className='rounded-none'>
                        {model.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

function SliderControl({ id, label, value, min, max, step, updateSettings }) {
    console.log(value);
    return (
        <div>
            <div className='flex justify-between'>
                <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
                    {label}
                </label>
                <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
                    {value}
                </label>
            </div>
            <input
                type='range'
                id={id}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(e) => updateSettings((prev) => ({ ...prev, [id]: Number(e.target.value) }))}
                className='mt-1 block w-full h-2 bg-gray-300 rounded-md cursor-pointer appearance-none focus:outline-none focus:ring-0'
                style={{
                    backgroundSize: `${((value - min) / (max - min)) * 100}% 100%`,
                }}
            />
            <div className='text-center text-sm font-semibold text-gray-700'>{value}</div>
        </div>
    );
}

function NumberInput({ id, label, value, updateSettings }) {
    return (
        <div>
            <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
                {label}
            </label>
            <input
                type='number'
                id={id}
                value={value}
                onChange={(e) => updateSettings((prev) => ({ ...prev, [id]: e.target.value }))}
                className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            />
        </div>
    );
}
