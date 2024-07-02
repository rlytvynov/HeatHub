import ContentLayout from '../../components/Layouts/ContentLayout'
import ItemCard from '../../components/ItemCard'
import TubularFiters, { TubularFilters } from './TubularFiters';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { tubularStore } from '../../data/products/tubularStore';
import { Tubular } from 'item';

type Props = {}

export default function TubularHeatingElementsWater({}: Props) {
    const filtersRef = useRef<TubularFilters | null>(null)
    const items = useSyncExternalStore(tubularStore.subscribe.bind(tubularStore), tubularStore.getSnapshot.bind(tubularStore));
    const [filteredItems, setFilteredItems] = useState<Tubular.itubular[]>([]);
    useEffect(() => {
        const uploadStore = async () => {
            await tubularStore.loadTubulars()
        }
        if(!tubularStore.uploaded) {
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
                const matchesWattage = item.wattage >= filters.wattage.min && item.wattage <= filters.wattage.max;
                const matchesShape = filters.shapes[item.shape];
                const matchesFittingDiameter = filters.fittingDiameters[item.fittingDiameter];
                const matchesTubeDiameter = filters.tubeDiameters[item.tubeDiameter];
                return matchesPrice && matchesWattage && matchesShape && matchesFittingDiameter && matchesTubeDiameter;
            });

            setFilteredItems(filteredItems);
        }
    }, [items]);
    
    return (
        <>
            <ContentLayout header='Tubular heating elements water'>
                <div className="items">
                    {   filteredItems.length !== 0 &&
                        filteredItems
                            .filter(item => item.type && item.subCategory === 'water')
                            .map((item, key) => {
                            return (
                                <ItemCard 
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
                    <TubularFiters filtersRef={filtersRef}/>
                    <button onClick={handleFiltersApply}>Apply Filters</button>
                </div>
            </ContentLayout>
        </>
    )
}