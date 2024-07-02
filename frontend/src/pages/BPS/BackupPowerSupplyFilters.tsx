import { BPS } from 'item';
import React, { useState, useEffect } from 'react';

export type BPSFilters = {
    price: { min: number, max: number },
    wattage: { min: number, max: number },
    voltage: Record<BPS.Voltage, boolean>,
    size: { min: number, max: number },
    ampers: { min: number, max: number },
}

const initialBPSValues: BPSFilters = {
    price: { min: 100, max: 300 },
    wattage: { min: 100, max: 300 },
    voltage: {
        '12v': true,
        '24v': true,
        '36v': true,
        '48v': true,
    },
    size: { min: 90, max: 160 },
    ampers: { min: 5, max: 12 },
}

const BackupPowerSupplyFilters = ({ filtersRef }: { filtersRef: React.MutableRefObject<BPSFilters | null> }) => {
    const [filters, setFilters] = useState<BPSFilters>(initialBPSValues);

    const isVoltage = (key: string): key is BPS.Voltage => ['12v', '24v', '36v', '48v'].includes(key);

    const updateFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const [category, key] = id.split('-');
            setFilters(prev => {
                if (category === 'voltage' && isVoltage(key)) {
                    return {
                        ...prev,
                        voltage: {
                            ...prev.voltage,
                            [key]: checked
                        }
                    }
                }
                return prev;
            });
        } else {
            const numericValue = parseFloat(value);
            switch (id) {
                case "min-price":
                    numericValue < filters.price.max && setFilters(prev => ({
                        ...prev,
                        price: { ...prev.price, min: numericValue }
                    }));
                    break;
                case "max-price":
                    numericValue > filters.price.min && setFilters(prev => ({
                        ...prev,
                        price: { ...prev.price, max: numericValue }
                    }));
                    break;
                case "min-wattage":
                    numericValue < filters.wattage.max && setFilters(prev => ({
                        ...prev,
                        wattage: { ...prev.wattage, min: numericValue }
                    }));
                    break;
                case "max-wattage":
                    numericValue > filters.wattage.min && setFilters(prev => ({
                        ...prev,
                        wattage: { ...prev.wattage, max: numericValue }
                    }));
                    break;
                case "min-size":
                    numericValue < filters.size.max && setFilters(prev => ({
                        ...prev,
                        size: { ...prev.size, min: numericValue }
                    }));
                    break;
                case "max-size":
                    numericValue > filters.size.min && setFilters(prev => ({
                        ...prev,
                        size: { ...prev.size, max: numericValue }
                    }));
                    break;
                case "min-ampers":
                    numericValue < filters.ampers.max && setFilters(prev => ({
                        ...prev,
                        ampers: { ...prev.ampers, min: numericValue }
                    }));
                    break;
                case "max-ampers":
                    numericValue > filters.ampers.min && setFilters(prev => ({
                        ...prev,
                        ampers: { ...prev.ampers, max: numericValue }
                    }));
                    break;
                default: return;
            }
        }
    };

    useEffect(() => {
        filtersRef.current = filters;
    }, [filters, filtersRef]);

    return (
        <>
            <fieldset>
                <legend>Price</legend>
                <div className="field-row">
                    <label htmlFor="min-price">Min:</label>
                    <input id="min-price" type="range" min="100" max="300" step={10} value={filters.price.min} onChange={updateFilters} />
                    <label htmlFor="min-price">{filters.price.min}</label>
                </div>
                <div className="field-row" style={{ marginTop: '1rem' }}>
                    <label htmlFor="max-price">Max:</label>
                    <input id="max-price" type="range" min="100" max="300" step={10} value={filters.price.max} onChange={updateFilters} />
                    <label htmlFor="max-price">{filters.price.max}</label>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    Price range: {filters.price.min} - {filters.price.max}
                </div>
            </fieldset>
            <fieldset>
                <legend>Wattage</legend>
                <div className="field-row">
                    <label htmlFor="min-wattage">Min:</label>
                    <input id="min-wattage" type="range" min="100" max="300" step={10} value={filters.wattage.min} onChange={updateFilters} />
                    <label htmlFor="min-wattage">{filters.wattage.min}</label>
                </div>
                <div className="field-row" style={{ marginTop: '1rem' }}>
                    <label htmlFor="max-wattage">Max:</label>
                    <input id="max-wattage" type="range" min="100" max="300" step={10} value={filters.wattage.max} onChange={updateFilters} />
                    <label htmlFor="max-wattage">{filters.wattage.max}</label>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    Wattage range: {filters.wattage.min} - {filters.wattage.max}
                </div>
            </fieldset>
            <fieldset className="voltage">
                <legend>Voltage</legend>
                <div className="field-row">
                    <input type="checkbox" id="voltage-12v" checked={filters.voltage['12v']} onChange={updateFilters} />
                    <label htmlFor="voltage-12v">12v</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="voltage-24v" checked={filters.voltage['24v']} onChange={updateFilters} />
                    <label htmlFor="voltage-24v">24v</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="voltage-36v" checked={filters.voltage['36v']} onChange={updateFilters} />
                    <label htmlFor="voltage-36v">36v</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="voltage-48v" checked={filters.voltage['48v']} onChange={updateFilters} />
                    <label htmlFor="voltage-48v">48v</label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Size</legend>
                <div className="field-row">
                    <label htmlFor="min-size">Min:</label>
                    <input id="min-size" type="range" min="90" max="160" step={10} value={filters.size.min} onChange={updateFilters} />
                    <label htmlFor="min-size">{filters.size.min}</label>
                </div>
                <div className="field-row" style={{ marginTop: '1rem' }}>
                    <label htmlFor="max-size">Max:</label>
                    <input id="max-size" type="range" min="90" max="160" step={10} value={filters.size.max} onChange={updateFilters} />
                    <label htmlFor="max-size">{filters.size.max}</label>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    Size range: {filters.size.min} - {filters.size.max}
                </div>
            </fieldset>
            <fieldset>
                <legend>Ampers</legend>
                <div className="field-row">
                    <label htmlFor="min-ampers">Min:</label>
                    <input id="min-ampers" type="range" min="5" max="12" step={1} value={filters.ampers.min} onChange={updateFilters} />
                    <label htmlFor="min-ampers">{filters.ampers.min}</label>
                </div>
                <div className="field-row" style={{ marginTop: '1rem' }}>
                    <label htmlFor="max-ampers">Max:</label>
                    <input id="max-ampers" type="range" min="5" max="12" step={1} value={filters.ampers.max} onChange={updateFilters} />
                    <label htmlFor="max-ampers">{filters.ampers.max}</label>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    Ampers range: {filters.ampers.min} - {filters.ampers.max}
                </div>
            </fieldset>
        </>
    );
}

export default BackupPowerSupplyFilters;
