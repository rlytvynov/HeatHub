import React from 'react'
import ContentLayout from '../../components/Layouts/ContentLayout'

type Props = {}

export default function PressureGauges({}: Props) {
    return (
        <ContentLayout header='Pressure gauges'>
            <div className="items">
                Available soon...
                {/* {   filteredItems.length &&
                    filteredItems
                        .filter(item => item.subcategory && item.subcategory === 'water')
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
                { filteredItems.length === 0 && items.length !== 0 && <div>Nothing found</div> } */}
            </div>
            <div className="filters">
                {/* <TubularFiters filtersRef={filtersRef}/>
                <button onClick={handleFiltersApply}>Apply Filters</button> */}
            </div>
        </ContentLayout>
    )
}