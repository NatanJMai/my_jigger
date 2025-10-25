/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Map Leaflet
 */
import L from 'leaflet'
import { statesData } from '../maps/leaflet-data';
import markerIcon from '@/images/leaflet/marker-icon.png'
import markerShadow from '@/images/leaflet/marker-shadow.png'
import leafShadow from '@/images/leaflet/leaf-shadow.png'

class LeafletMap {
    constructor() {
        this.tileLayerUrl = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';
        this.tileLayerOptions = {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 18
        };
    }

    init() {
        this.initBasicMap();
        this.initShapeMap();
        this.initDraggableMap();
        this.initUserLocation();
        this.initCustomIcons();
        this.initLayerControl();
        this.initGeoJsonMap();
    }

    addTileLayer(map) {
        L.tileLayer(this.tileLayerUrl, this.tileLayerOptions).addTo(map);
    }

    initBasicMap() {
        const element = document.getElementById('basicMap');
        if (element) {
            const map = L.map(element).setView([42.35, -71.08], 10);
            this.addTileLayer(map);
        }
    }

        initShapeMap() {
            const element = document.getElementById('shapeMap');
            if (element) {
                const map = L.map(element).setView([51.5, -0.09], 12);

                const customIcon = L.icon({
                    iconUrl: markerIcon,
                    shadowUrl: markerShadow
                });

                L.marker([51.5, -0.09], { icon: customIcon }).addTo(map);
                L.circle([51.508, -0.11], {
                    color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: 500
                }).addTo(map);
                L.polygon([
                    [51.509, -0.08], [51.503, -0.06], [51.51, -0.047]
                ]).addTo(map);

                this.addTileLayer(map);
            }
        }

    initDraggableMap() {
        const element = document.getElementById('dragMap');
        if (element) {
            const map = L.map(element).setView([48.817152, 2.455], 12);

            const customIcon = L.icon({
                iconUrl: markerIcon,
                shadowUrl: markerShadow
            });

            const marker = L.marker([48.817152, 2.455], {draggable: true,icon: customIcon}).addTo(map);
            marker.bindPopup("<b>You're here!</b>").openPopup();

            this.addTileLayer(map);
        }
    }

    initUserLocation() {
        const element = document.getElementById('userLocation');
        if (element) {
            const map = L.map(element).setView([42.35, -71.08], 10);
            map.locate({setView: true, maxZoom: 16});

            map.on('locationfound', (e) => {
                L.marker(e.latlng).addTo(map)
                    .bindPopup(`You are somewhere around ${Math.round(e.accuracy)} meters from this point`)
                    .openPopup();
                L.circle(e.latlng, e.accuracy).addTo(map);
            });

            this.addTileLayer(map);
        }
    }

    initCustomIcons() {
        const element = document.getElementById('customIcons');
        if (element) {
            const map = L.map(element).setView([51.5, -0.09], 10);

            const iconConfig = (color) => L.icon({
                iconUrl: `/images/leaflet/leaf-${color}.png`,
                shadowUrl: leafShadow,
                iconSize: [38, 95], shadowSize: [50, 64],
                iconAnchor: [22, 94], shadowAnchor: [4, 62],
                popupAnchor: [-3, -76]
            });

            L.marker([51.5, -0.09], {icon: iconConfig('red')}).addTo(map);
            L.marker([51.4, -0.51], {icon: iconConfig('green')}).addTo(map);
            L.marker([51.49, -0.45], {icon: iconConfig('orange')}).addTo(map);

            this.addTileLayer(map);
        }
    }

    initLayerControl() {
        const element = document.getElementById('layerControl');
        if (element) {
            const customIcon = L.icon({
                iconUrl: markerIcon,
                shadowUrl: markerShadow
            });

            const littleton = L.marker([39.61, -105.02], { icon: customIcon }).bindPopup('This is Littleton, CO.'),
                denver = L.marker([39.74, -104.99], { icon: customIcon }).bindPopup('This is Denver, CO.'),
                aurora = L.marker([39.73, -104.8], { icon: customIcon }).bindPopup('This is Aurora, CO.'),
                golden = L.marker([39.77, -105.23], { icon: customIcon }).bindPopup('This is Golden, CO.');

            const cities = L.layerGroup([littleton, denver, aurora, golden]);
            const street = L.tileLayer(this.tileLayerUrl, this.tileLayerOptions);
            const watercolor = L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
                attribution: this.tileLayerOptions.attribution, maxZoom: 18
            });

            const map = L.map(element, {
                center: [39.73, -104.99],
                zoom: 10,
                layers: [street, cities]
            });

            const baseMaps = {Street: street, Watercolor: watercolor};
            const overlayMaps = {Cities: cities};

            L.control.layers(baseMaps, overlayMaps).addTo(map);
        }
    }

    initGeoJsonMap() {
        const element = document.getElementById('geoJson');
        if (element && typeof statesData !== 'undefined') {
            const map = L.map(element).setView([44.2669, -72.576], 3);

            const getColor = (d) => {
                return d > 1000 ? '#800026' :
                    d > 500 ? '#BD0026' :
                        d > 200 ? '#E31A1C' :
                            d > 100 ? '#FC4E2A' :
                                d > 50 ? '#FD8D3C' :
                                    d > 20 ? '#FEB24C' :
                                        d > 10 ? '#FED976' : '#FFEDA0';
            };

            const style = (feature) => ({
                fillColor: getColor(feature.properties.density),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            });

            L.geoJson(statesData, {style}).addTo(map);
            this.addTileLayer(map);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LeafletMap().init();
});