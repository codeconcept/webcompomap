class CcMap extends HTMLElement {
    constructor() {
        super();       
        // store shadow root reference in a _root variable
        this._root = this.attachShadow({ mode: 'open' }); 
        console.log('this._root',this._root);

        // DOM elements
        this._mapTitle = null;
        this._mapTitleText = '';

        // data
        this._geoData = {
            center:  {
                lat: 48.1173,
                lng: -1.6778
            },
            title: 'Rennes',
            zoom: this._zoom
        };
        this._componentReady = false;
        this._map = null;
        this._zoom = 12;
        this._markersPositions = [];
    }
    
    connectedCallback() {
        console.log('cc-map added to the DOM');
        this._componentReady = true;
        this._root.innerHTML = `
        <style>
        #map {
            height: 400px;
            width: 100%;
        }
        </style>
        <h1 id="map-title"></h1>
        <div id="map">
        </div>
        `;
        this._mapDiv = this._root.getElementById('map');  
        this._mapTitle = this._root.getElementById('map-title');      
        this._render();
    }

    _render() {
        if(!window.google) {
            console.log('Google maps NOT ready');
            return;
        }
       
        this._initMap({ center: this._geoData.center, zoom: 12});
    }

    _renderTitle() {
        this._mapTitle.innerText = this._mapTitleText;
    }

    _initMap(options) {
        this._map = new window.google.maps.Map(this._mapDiv, {
            zoom: options.zoom,
            center: options.center
        });
    }

    _addMarker(options) {
        const marker = new window.google.maps.Marker({
            position: options.position,
            map: this._map,
            icon: 'https://maps.gstatic.com/intl/en_ALL/mapfiles/dd-start.png'
        });
        console.log('marker', marker);

        const infoWindow = new window.google.maps.InfoWindow({
            content: options.content
        });

        marker.addListener('click', () => infoWindow.open(this._map, marker));
    }

    static get observedAttributes() {
        return ['zoom'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(!this._componentReady) return;

        console.log(`name: ${name} - old value: ${oldValue} - new value: ${newValue}`);
        if(name === 'zoom') {            
            const mapOptions = {
                zoom: parseInt(newValue),
                center: this._geoData.center
            };
            this._initMap(mapOptions);
        }
    }



    // getter and setter that will allow to programmatically get and set coords and map title
    set geoData(value) {
        if(this._geoData === value) return;
        this._geoData = value;
        this._initMap(this._geoData);
    }

    get geoData() {
        return this._geoData;
    }

    // getter and setter that will allow to programmatically get and set zoom level    
    set zoom(value) {
        if(this._zoom === value) return;
        this._zoom = value;
        this._geoData.zoom = this._zoom;
        this._initMap(this._geoData);
    }

    get zoom() {
        return this._zoom;
    }

    // getter and setter that will allow to programmatically get and set map title
    set mapTitleText(value) {
        if(this._mapTitleText === value) return;
        this._mapTitleText = value;
        this._renderTitle();
    }

    get mapTitleText() {
        return this._mapTitleText;
    }

    set mostRecentMarker(value) {
        // todo prevent duplicates
        this._markersPositions = [...this.markersPositions, value];
        this._addMarker(value);
    }

    get mostRecentMarker() {
        const arrayLength = this._markersPositions.length;
        if(arrayLength > 0) {
            return this._markersPositions[arrayLength - 1];
        } else {
            return {};
        }
    }

    set markersPositions(value) {
        this._addMarker(value);
    }

    get markersPositions() {
        return this._markersPositions;
    }
    

} // end class
window.customElements.define('cc-map', CcMap);