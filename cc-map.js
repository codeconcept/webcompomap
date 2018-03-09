class CcMap extends HTMLElement {
    constructor() {
        super();       
        // store shadow root reference in a _root variable
        this._root = this.attachShadow({ mode: 'open' }); 
        console.log('this._root',this._root);

        // data
        this.rennes = {
            lat: 48.1173,
            lng: -1.6778
        };
        this._componentReady = false;
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
        <div id="map">
        </div>
        `;
        this._mapDiv = this._root.getElementById('map');        
        this._render();
    }

    _render() {
        if(!window.google) {
            console.log('Google maps NOT ready');
            return;
        }
       
        this._initMap({ center: this.rennes, zoom: 12});
    }

    _initMap(options) {
        var map = new window.google.maps.Map(this._mapDiv, {
            zoom: options.zoom,
            center: options.center
        });
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
                center: this.rennes
            };
            this._initMap(mapOptions);
        }
    }

} // end class
window.customElements.define('cc-map', CcMap);