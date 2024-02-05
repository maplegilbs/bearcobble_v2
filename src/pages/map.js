//Libraries
import { GoogleMap, useJsApiLoader, KmlLayer } from "@react-google-maps/api";
import { useCallback, useState } from "react";
//Styles
import map_styles from '@/styles/map_page_styles.module.scss'

export async function getServerSideProps() {
    return ({ props: { apiKey: process.env.GOOGLE_MAPS_API } })
}

export default function Woods_Map({ apiKey }) {
    const [map, setMap] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    })

    function locate() {
        map.setZoom(19);
        navigator.geolocation.getCurrentPosition(initialLocate, locateError, options)
        navigator.geolocation.watchPosition(locateSuccess, locateError, options)
    }

    function initialLocate(position) {
        map.setZoom(18);
        const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        map.setCenter(pos);
        infoWindow.setContent("<img src='https://sapmappers.com/sensors/bearcobble/Images/bearpaw.png' width='17px'>");
    }

    function locateSuccess(position) {
        const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.open(map);
        console.log(position.coords.accuracy);
    };

    function locateError() {
        alert("Error: Make sure location settings are on and the site is using https.");
    };

    const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
    };

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation
                ? "Error: Make sure location settings are on and the site is using https"
                : "Error: Your browser doesn't support geolocation."
        );
        infoWindow.open(map);
    }


    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(44.184285, -72.961111),
            new window.google.maps.LatLng(44.163204, -72.942872))
        map.fitBounds(bounds);
        setInfoWindow(new window.google.maps.InfoWindow())
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])


    return isLoaded ? (
        <div className={map_styles.map_container}>

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
                    url='https://sapmappers.com/sensors/bearcobble/ConductorsA.kml'
                    options={{ preserveViewport: true }}
                />
                <KmlLayer
                    url='https://sapmappers.com/sensors/bearcobble/KML/Roads4.kml'
                    options={{ preserveViewport: true }}
                />
                <KmlLayer
                    url='https://sapmappers.com/sensors/bearcobble/KML/Driveway.kml'
                    options={{ preserveViewport: true }}
                />
                <KmlLayer
                    url='https://sapmappers.com/sensors/bearcobble/KML/Section1.kml'
                    options={{ preserveViewport: true }}
                />
                <KmlLayer
                    url='https://sapmappers.com/sensors/bearcobble/KML/Section2a.kml'
                    options={{ preserveViewport: true }}
                />
                <KmlLayer
                    url='https://sapmappers.com/sensors/bearcobble/KML/Section3a.kml'
                    options={{ preserveViewport: true }}
                />
                <KmlLayer
                    url='https://sapmappers.com/sensors/bearcobble/KML/Section4.kml'
                    options={{ preserveViewport: true }}
                />
                <KmlLayer
                    url='https://sapmappers.com/sensors/bearcobble/KML/Section5.kml'
                    options={{ preserveViewport: true }}
                />
                <button className={map_styles.zoom_to_me} onClick={locate}>Zoom To Me</button>
            </GoogleMap>
        </div>
    ) : <></>

}