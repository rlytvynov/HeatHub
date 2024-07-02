import { Tubular } from 'item'
import React, { useEffect, useState } from 'react'

export type TubularFilters = {
    price: { min: number, max: number },
    wattage: { min: number, max: number },
    shapes: Record<Tubular.ShapeType, boolean>,
    fittingDiameters: Record<Tubular.FittingDiameterType, boolean>,
    tubeDiameters: Record<Tubular.TubeDiameterType, boolean>
}

const initialValues: TubularFilters = {
    price: { min: 100, max: 1000 },
    wattage: { min: 250, max: 1500 },
    shapes: {
        spiral: true,
        staple: true,
        uShape: true,
        straight: true
    },
    fittingDiameters: {
        '10mm': true,
        '12mm': true,
        '14mm': true,
        '16mm': true,
        '18mm': true,
        '1/2"': true,
        '22mm': true
    },
    tubeDiameters: {
        '13.5mm': true,
        '10mm': true,
        '8.5mm': true,
        '6.5mm': true
    }
}

type Props = {
    filtersRef: React.MutableRefObject<TubularFilters | null>;
}

export default function TubularFiters({filtersRef}: Props) {
    const [filters, setFilters] = useState<TubularFilters>(initialValues)

    const isShape = (key: string): key is Tubular.ShapeType => ['spiral', 'staple', 'uShape', 'straight'].includes(key);
    const isFittingDiameter = (key: string): key is Tubular.FittingDiameterType => ['10mm', '12mm', '14mm', '16mm', '18mm', '1/2"', '22mm'].includes(key);
    const isTubeDiameter = (key: string): key is Tubular.TubeDiameterType => ['13.5mm', '10mm', '8.5mm', '6.5mm'].includes(key);

    const updateFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const [category, key] = id.split('-');
            setFilters(prev => {
                if (category === 'shapes' && isShape(key)) {
                    return {
                        ...prev,
                        shapes: {
                            ...prev.shapes,
                            [key]: checked
                        }
                    }
                } else if (category === 'fittingDiameters' && isFittingDiameter(key)) {
                    return {
                        ...prev,
                        fittingDiameters: {
                            ...prev.fittingDiameters,
                            [key]: checked
                        }
                    }
                } else if (category === 'tubeDiameters' && isTubeDiameter(key)) {
                    return {
                        ...prev,
                        tubeDiameters: {
                            ...prev.tubeDiameters,
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
                default: return;
            }
        }
    };

    useEffect(() => {
        filtersRef.current = filters
    }, [filters])

  return (
    <>
        <fieldset>
            <legend>Price</legend>
            <div className="field-row">
                <label htmlFor="min">Min:</label>
                <label htmlFor="min-price">100</label>
                <input id="min-price" type="range" min="100" max="1000" step={10} value={filters.price.min} onChange={updateFilters} />
                <label htmlFor="min">1000</label>
            </div>
            <div className="field-row" style={{marginTop: '1rem'}}>
                <label htmlFor="max">Max:</label>
                <label htmlFor="max-price">100</label>
                <input id="max-price" type="range" min="100" max="1000" step={10} value={filters.price.max} onChange={updateFilters} />
                <label htmlFor="max">1000</label>
            </div>
            <div style={{marginTop: '1rem'}}>
                Price range: {filters.price.min} - {filters.price.max}
            </div>
        </fieldset>
        <fieldset>
            <legend>Wattage</legend>
            <div className="field-row">
                <label htmlFor="min">Min:</label>
                <label htmlFor="min-wattage">250</label>
                <input id="min-wattage" type="range" min="250" max="1500" step={10} value={filters.wattage.min} onChange={updateFilters} />
                <label htmlFor="min">1500</label>
            </div>
            <div className="field-row" style={{marginTop: '1rem'}}>
                <label htmlFor="max">Max:</label>
                <label htmlFor="max-wattage">250</label>
                <input id="max-wattage" type="range" min="250" max="1500" step={10} value={filters.wattage.max} onChange={updateFilters} />
                <label htmlFor="max">1500</label>
            </div>
            <div style={{marginTop: '1rem'}}>
                Wattage range: {filters.wattage.min} - {filters.wattage.max}
            </div>
        </fieldset>
        <fieldset className="shapes">
            <legend>Shapes</legend>
            <div className="field-row">
                <input type="checkbox" id="shapes-spiral" checked={filters.shapes.spiral} onChange={updateFilters} />
                <label htmlFor="shapes-spiral">Spiral</label>
            </div>
            <div className="field-row">
                <input type="checkbox" id="shapes-staple" checked={filters.shapes.staple} onChange={updateFilters} />
                <label htmlFor="shapes-staple">Staple</label>
            </div>
            <div className="field-row">
                <input type="checkbox" id="shapes-uShape" checked={filters.shapes.uShape} onChange={updateFilters} />
                <label htmlFor="shapes-uShape">U-shaped</label>
            </div>
            <div className="field-row">
                <input type="checkbox" id="shapes-straight" checked={filters.shapes.straight} onChange={updateFilters} />
                <label htmlFor="shapes-straight">Straight</label>
            </div>
        </fieldset>
        <fieldset className="configuration" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <legend>Configuration</legend>
            <fieldset className="fitting-diameters">
                <legend style={{ textAlign: 'center' }}>Fitting diameters</legend>
                <div className="field-row">
                    <input type="checkbox" id="fittingDiameters-10mm" checked={filters.fittingDiameters['10mm']} onChange={updateFilters} />
                    <label htmlFor="fittingDiameters-10mm">10mm</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="fittingDiameters-12mm" checked={filters.fittingDiameters['12mm']} onChange={updateFilters} />
                    <label htmlFor="fittingDiameters-12mm">12mm</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="fittingDiameters-14mm" checked={filters.fittingDiameters['14mm']} onChange={updateFilters} />
                    <label htmlFor="fittingDiameters-14mm">14mm</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="fittingDiameters-16mm" checked={filters.fittingDiameters['16mm']} onChange={updateFilters} />
                    <label htmlFor="fittingDiameters-16mm">16mm</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="fittingDiameters-18mm" checked={filters.fittingDiameters['18mm']} onChange={updateFilters} />
                    <label htmlFor="fittingDiameters-18mm">18mm</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id='fittingDiameters-1/2"' checked={filters.fittingDiameters['1/2"']} onChange={updateFilters} />
                    <label htmlFor='fittingDiameters-1/2"'>1/2"</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="fittingDiameters-22mm" checked={filters.fittingDiameters['22mm']} onChange={updateFilters} />
                    <label htmlFor="fittingDiameters-22mm">22mm</label>
                </div>
            </fieldset>
            <fieldset className="tube-diameters">
                <legend style={{ textAlign: 'center' }}>Tube diameters</legend>
                <div className="field-row">
                    <input type="checkbox" id="tubeDiameters-13.5mm" checked={filters.tubeDiameters['13.5mm']} onChange={updateFilters} />
                    <label htmlFor="tubeDiameters-13.5mm">13.5mm</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="tubeDiameters-10mm" checked={filters.tubeDiameters['10mm']} onChange={updateFilters} />
                    <label htmlFor="tubeDiameters-10mm">10mm</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="tubeDiameters-8.5mm" checked={filters.tubeDiameters['8.5mm']} onChange={updateFilters} />
                    <label htmlFor="tubeDiameters-8.5mm">8.5mm</label>
                </div>
                <div className="field-row">
                    <input type="checkbox" id="tubeDiameters-6.5mm" checked={filters.tubeDiameters['6.5mm']} onChange={updateFilters} />
                    <label htmlFor="tubeDiameters-6.5mm">6.5mm</label>
                </div>
            </fieldset>
        </fieldset>
    </>
  )
}