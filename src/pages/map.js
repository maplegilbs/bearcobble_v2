//Libraries
import { GoogleMap, useJsApiLoader, KmlLayer } from "@react-google-maps/api";
import { useCallback, useState } from "react";

export async function getServerSideProps() {
    return ({ props: { apiKey: process.env.GOOGLE_MAPS_API } })
}

export default function Woods_Map({ apiKey }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    })

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(44.184285, -72.961111),
            new window.google.maps.LatLng(44.163204, -72.942872))
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])


    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={{ height: '95vh', width: '100%' }}
            center={{ lat: 44.172887, lng: -72.956834 }}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                mapTypeId: 'terrain',
                mapTypeControl: true,
                controlSize: 30
            }}
        >
            <KmlLayer
                url='http://bearcobble.com/KML/ConductorsA.kml'
                options={{ preserveViewport: true }}
            />
            <KmlLayer
                url='http://bearcobble.com/KML/Roads4.kml'
                options={{ preserveViewport: true }}
            />
            <KmlLayer
                url='http://bearcobble.com/KML/Driveway.kml'
                options={{ preserveViewport: true }}
            />
            <KmlLayer
                url='http://bearcobble.com/KML/Section1.kml'
                options={{ preserveViewport: true }}
            />
            <KmlLayer
                url='http://bearcobble.com/KML/Section2a.kml'
                options={{ preserveViewport: true }}
            />
            <KmlLayer
                url='http://bearcobble.com/KML/Section3a.kml'
                options={{ preserveViewport: true }}
            />
            <KmlLayer
                url='http://bearcobble.com/KML/Section4.kml'
                options={{ preserveViewport: true }}
            />
            <KmlLayer
                url='http://bearcobble.com/KML/Section5.kml'
                options={{ preserveViewport: true }}
            />

        </GoogleMap>
    ) : <></>

}