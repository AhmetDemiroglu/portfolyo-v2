import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

/* Leaflet is ~150 KB and only ever appears on /contact, so this module is loaded
   lazily. Keeping the L.* setup in here (rather than in the route file) is what
   stops the router's static route import from pulling leaflet into the entry
   chunk of every page. */

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/* CARTO started watermarking raster tiles that arrive without a key. The key is
   public by design (it ships in the bundle, has no domain lock) and a missing or
   wrong one degrades to the watermark rather than breaking the map, so there is
   no fallback path to maintain here. Set VITE_CARTO_KEY in Netlify as well as
   .env.local, otherwise the production build renders the watermarked tiles. */
const CARTO_KEY = import.meta.env.VITE_CARTO_KEY ?? "";

const LIGHT_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DARK_TILES = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`;

/* CARTO's terms require its attribution to stay visible wherever its tiles are
   drawn, so the credit follows the theme the same way the tiles do. */
const LIGHT_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const DARK_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function LocationMap({
    theme,
    popupHtml,
}: {
    theme: "light" | "dark";
    popupHtml: string;
}) {
    return (
        <MapContainer
            center={[38.4237, 27.1428]}
            zoom={10}
            scrollWheelZoom={false}
            className="h-full w-full"
        >
            <TileLayer
                attribution={theme === "light" ? LIGHT_ATTRIBUTION : DARK_ATTRIBUTION}
                url={theme === "light" ? LIGHT_TILES : DARK_TILES}
            />
            <Marker position={[38.4237, 27.1428]}>
                <Popup>
                    <span dangerouslySetInnerHTML={{ __html: popupHtml }} />
                </Popup>
            </Marker>
        </MapContainer>
    );
}
