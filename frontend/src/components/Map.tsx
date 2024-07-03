import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export default function YMap(){
  return (
    <YMaps>
        <Map width={'100%'} height={630} defaultState={{ center: [46.843415, 35.382672], zoom: 15 }}>
            <Placemark geometry={[46.843415, 35.382672]} />
        </Map>
    </YMaps>
  )
}