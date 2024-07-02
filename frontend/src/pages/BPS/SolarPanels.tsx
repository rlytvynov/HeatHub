import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import ContentLayout from '../../components/Layouts/ContentLayout'
import BackupPowerSupplyFilters, { BPSFilters } from './BackupPowerSupplyFilters';
import { bpsStore } from '../../data/products/bpsStore';
import { BPS } from 'item';
import ItemCard from '../../components/ItemCard';

type Props = {}

export default function SolarPanels({}: Props) {
    const filtersRef = useRef<BPSFilters | null>(null)
    const items = useSyncExternalStore(bpsStore.subscribe.bind(bpsStore), bpsStore.getSnapshot.bind(bpsStore));
    const [filteredItems, setFilteredItems] = useState<BPS.ibps[]>([]);
    useEffect(() => {
        const uploadStore = async () => {
            await bpsStore.loadBps()
        }
        if(!bpsStore.uploaded) {
            uploadStore()
            console.log('tubulars uploaded!')
        } else {
            setFilteredItems(items)
        }
        
    }, [items])
    const handleFiltersApply = useCallback(() => {
        const filters = filtersRef.current;
        if (filters) {
            const filteredItems = items.filter(item => {
                const matchesPrice = item.price >= filters.price.min && item.price <= filters.price.max;
                const matchesWattage = item.wattage === undefined || (item.wattage >= filters.wattage.min && item.wattage <= filters.wattage.max);
                const matchesVoltage = filters.voltage[item.voltage];
                const matchesSize = item.size === undefined || (item.size >= filters.size.min && item.size <= filters.size.max);
                const matchesAmpers = item.ampers === undefined || (item.ampers >= filters.ampers.min && item.ampers <= filters.ampers.max);
                return matchesPrice && matchesWattage && matchesVoltage && matchesSize && matchesAmpers;
            });
            setFilteredItems(filteredItems);
        }
    }, [items]);
    return (
        <ContentLayout header='Solar panels'>
            <div className="items">
                {   filteredItems.length !== 0 &&
                    filteredItems
                        .map((item, key) => {
                        return (
                            item.subCategory === 'solar-panels' && <ItemCard 
                                key={key}
                                {...item}
                            />
                        )
                    })
                }
                { items.length === 0 && <div>Loading...</div> }
                { filteredItems.length === 0 && items.length !== 0 && <div>Nothing found</div> }
            </div>
            <div className="filters">
                <BackupPowerSupplyFilters filtersRef={filtersRef}/>
                <button onClick={handleFiltersApply}>Apply Filters</button>
            </div>
        </ContentLayout>
    )
}