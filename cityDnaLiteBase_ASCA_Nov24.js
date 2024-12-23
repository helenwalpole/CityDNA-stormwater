// preload QR code
// const QRsymbol = new Image();
// QRsymbol.src =
//   "https://en.wikipedia.org/wiki/QR_code#/media/File:QR_code_for_mobile_English_Wikipedia.svg";

mapboxgl.accessToken =
    "pk.eyJ1IjoiZ2lzZmVlZGJhY2siLCJhIjoiY2tzNno0d2JjMDJpaTJ1bjA3bnRtdHMzbiJ9.i7UvPZAAwdp9h7_R558ETg";
const melbCoords = [144.9602, -37.8158];

// Instantiate a map
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/gisfeedback/cl28atjkh000815nmlfpw22n3", //CityDNA projector, dark mode  
    center: melbCoords,
    // 'center': [144.9452, -37.8108],
    zoom: 14.225,
    // 'zoom': 12,
    bearing: -0.2,
});

map.on("load", function () {
    // disable manual movement of the map
    map.keyboard.disable();
    map.scrollZoom.disable();
    map.doubleClickZoom.disable();
    map.dragPan.disable();
    map.boxZoom.disable();

    // Add overlay layer to the map to use for a dimming effect.
    // Create large geojson polygon
    const ComOverlay = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: { Name: "Overlay", description: null },
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [144.9, -37.787],
                            [145.0, -37.787],
                            [145.0, -37.836],
                            [144.9, -37.836],
                            [144.9, -37.787],
                        ],
                    ],
                },
            },
        ],
    };
    // Create source for the polygon
    map.addSource("overlaySource", {
        type: "geojson",
        data: ComOverlay,
    });
    // Add the polygon to the map as a layer
    map.addLayer({
        id: "dimmableOverlayLayer",
        source: "overlaySource",
        type: "fill",
        paint: {
            "fill-color": "#000000",
            "fill-opacity": 0.5,
        },
        layout: {
            visibility: "none",
        },
    });

    // ADD A MASKING OVERLAY LAYER THAT STOPS LIGHT SPILLING ONTO THE CARPET.
    // This layer needs to be placed on top of all other layers to mask out overspill, or it will project onto the carpet surrounding the 3D model.
    // Create large geojson polygon
    const ComMask = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: { Name: "Overlay", description: null },
                geometry: {
                    type: "Polygon", // this is a donut polygon, so it has an outer ring and an inner ring
                    coordinates: [
                        [
                            [144.8751, -37.7559], // top left of outer polygon ring
                            [145.0413, -37.7614], // top right of outer polygon ring
                            [145.0352, -37.8872], // bottom right of outer polygon ring
                            [144.8576, -37.8799], // bottom left of outer polygon ring
                            [144.8751, -37.7559], // top left again of outer polygon ring
                            [144.9333, -37.8009], // Flemington corner (inner ring)
                            [144.9314, -37.8267], // Westgate at docklands
                            [144.941352, -37.8258], // Westgate north apex
                            [144.958476, -37.8288], // Westgate south apex
                            [144.961847, -37.827943], // Westgate and Queens Rd
                            [144.965596, -37.830924], // Queens rd and Dorcas st
                            [144.9889, -37.8313], // Punt and river
                            [144.9885, -37.809577], // Punt and Victoria
                            [144.973251, -37.807702], //Victoria and Nicholson
                            [144.97417, -37.802], // Top of carlton gardens
                            [144.9333, -37.8009], //Flemington corner again (inner ring)
                            [144.8751, -37.7559], // top left again of outer ring, to close the polygon
                        ],
                    ],
                },
            },
        ],
    };
    // Create source for the polygon
    map.addSource("maskSource", {
        type: "geojson",
        data: ComMask,
    });
    // Add the masking polygon to the map as a layer
    map.addLayer({
        id: "maskLayer",
        source: "maskSource",
        type: "fill",
        paint: {
            "fill-color": "#000000",
        },
        layout: {
            visibility: "visible",
        },
    });

    // Establish global variables for the operation of presentation mode
    let layersList = [];
    let statesList = [];
    let stateNamesList = [];

    //////////////////////////////////
    // ADD CUSTOM DATA SOURCES HERE //
    //////////////////////////////////

    // Add the sources for each removable data layers from CoM mapbox accounts
    // Later, the user will be able to add and remove them from to map

    map.addSource("historic waterbodies", {
        type: "vector",
        url: "mapbox://gisfeedback.1i5lqft0",
    });

    map.addSource("inundation overlay", {
        type: "vector",
        url: "mapbox://gisfeedback.d9odmxcc",
    });

    map.addSource("tree canopy", {
        type: "vector",
        url: "mapbox://gisfeedback.d8iemsiw",
    });

    map.addSource("urban forest", {
        type: "vector",
        url: "mapbox://gisfeedback.94v8lmwk",
    });

    map.addSource("urban heat 1600", {
        type: "image",
        url: "https://live.staticflickr.com/65535/52919498869_ec77533e99_k.jpg",
        coordinates: [
            [144.897, -37.7748], //left top
            [144.992, -37.7748], //right top
            [144.992, -37.8508], //right bottom
            [144.897, -37.8508], //left bottom
        ],
    });

    map.addSource("clue boundaries", {
        type: "vector",
        url: "mapbox://gisfeedback.879gqh08",
    });

    map.addSource("stormwater drains", {
        type: "vector",
        url: "mapbox://gisfeedback.6cmfloda",
    });

    map.addSource("Town Hall", {
        type: "geojson",
        data: {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [144.96669, -37.81511],
            },
            properties: {
                name: "Town Hall",
            },
        },
    });

    map.addSource("stormwater sensors", {
        type: "vector",
        url: "mapbox://gisfeedback.cm2bcxstq1zw11mnsjat9yl8e-5aypm",
    });

    map.addSource("vegetation classes", {
        type: "vector",
        url: "mapbox://gisfeedback.80q2csfn",
    });

    map.loadImage(
        'https://live.staticflickr.com/65535/54162401719_982b54ba7c.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('qrIcon1', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54162362528_2b69234efc.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('qrIcon2', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54162544515_28c52a6ebc.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('qrIcon3', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54162088081_55bc6fcb90.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('qrIcon4', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54162362393_ed2d60de2c.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('qrIcon5', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54162544415_ce05e47298.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('qrIcon6', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54162401634_2a5ee8884f.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('qrIcon7', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54162088031_ae10853f76.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('qrIcon8', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54163596577_fb22da9566_t.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('alertIcon', image);
        }
    );

    map.loadImage(
        'https://live.staticflickr.com/65535/54164945355_816d30797d_t.jpg',
        function (error, image) {
            if (error) throw error;
            map.addImage('brokenIcon', image);
        }
    );

    map.addSource("stormwater game", {
        type: 'vector',
        url: 'mapbox://gisfeedback.cm3w5zpo61z131mnav8q5p55z-3aipm'
    });


    map.addSource("stormwater game QRs", {
        type: 'vector',
        url: 'mapbox://gisfeedback.cm3w8fkzd1kq21ut6vgtihrsp-7otg3'
    });


    // Define each map state within a function.
    // A map state can contain multiple layers and/or animation, and is sort of like a powerpoint 'slide'.
    map.getCanvas().style.cursor = "crosshair";

    // add a circle for Town Hall that will remain visible regardless of other layers.
    map.addLayer({
        id: "Show Town Hall",
        source: "Town Hall",
        type: "circle",
        paint: {
            "circle-radius": 10,
            "circle-stroke-color": "#ff7adc",
            "circle-stroke-width": 2,
            "circle-color": 'rgba(0,0,0,0)'
        },
    });

    // 1 - PRECOLONIAL WATER / VEG
    function loadHistoricWaterbodiesStory() {
        layersList = ["Show vegetation classes", "Show historic waterbodies"];

        map.addLayer(
            {
                id: "Show historic waterbodies",
                source: "historic waterbodies",
                "source-layer": "am_historic_waterbodies-4s9ed7",
                type: "fill",
                paint: {
                    "fill-color": "#6e9ae6",
                    "fill-opacity": 0.8,
                },
            },
            "maskLayer"
        );

        map.addLayer(
            {
                id: "Show vegetation classes",
                source: "vegetation classes",
                "source-layer": "CDX_vegetationClasses-da9zx7",
                type: "fill",
                paint: {
                    "fill-color": [
                        "match",
                        ["get", "XGROUPNAME"],
                        "Heathy Woodlands",
                        "#77A481", // WOODLANDS deep green
                        "Plains Woodlands or Forests",
                        "#77A481", // WOODLANDS deep green
                        "Riverine Grassy Woodlands or Forests",
                        "#77A481", // WOODLANDS deep green
                        "Herb-rich Woodlands",
                        "#77A481", // WOODLANDS deep green
                        "Lower Slopes or Hills Woodlands",
                        "#D3D29C", // GRASSLANDS tan
                        "Riparian Scrubs or Swampy Scrubs and Woodlands",
                        "#AED694", // SCRUBLANDS // mid green
                        "Plains Grasslands and Chenopod Shrublands",
                        "#D3D29C", // GRASSLANDS tan
                        "Wetlands",
                        "#689C9C", // WETLANDS blue-green
                        "Salt-tolerant and/or succulent Shrublands",
                        "#689C9C", // WETLANDS blue-green
                        "No native vegetation recorded",
                        "#000000", // WATER black
                        "#222222", //other
                    ],
                    "fill-opacity": 0.75,
                },
            },
            "Show historic waterbodies"
        );
    }
    statesList.push(loadHistoricWaterbodiesStory);
    stateNamesList.push("loadHistoricWaterbodiesStory");

    // 2 - ADD 1% FLOOD MODEL
    function loadInundationState() {
        layersList = ["Show inundation overlay"];
        map.addLayer({
            id: "Show inundation overlay",
            source: "inundation overlay",
            "source-layer": "inundation_draft-4wvray",
            type: "fill",
            paint: {
                "fill-color": "#40ffff",
                // 'line-width': 4,
                "fill-opacity": 0.5,
            },
            layout: {
                // 'visibility': 'none'
            },
        });
        // ADD LEGEND
        document.getElementById("legend").innerHTML = `
                <div style='text-align: left'>City of Melbourne planning scheme flood map (updated 2022)
                </div>`;
    }
    statesList.push(loadInundationState);
    stateNamesList.push("loadInundationState");

    // 3 - TREE CANOPY
    function loadTreeCanopyState() {
        layersList = ["Show tree canopy"];
        map.addLayer({
            id: "Show tree canopy",
            source: "tree canopy",
            "source-layer": "TreeCanopy-8k8q0y",
            type: "fill",
            paint: {
                "fill-color": "#44ff33", //#40ffff = peppermint green
                // 'line-width': 4,
                "fill-opacity": 0.9,
            },
            layout: {
                // 'visibility': 'none'
            },
        });
        document.getElementById("legend").innerHTML = `
        <div style='text-align: left'>        
        <div class='legendLabel'>Urban forest canopy</div>
        </div>`;
    }
    statesList.push(loadTreeCanopyState);
    stateNamesList.push("loadTreeCanopyState");

    // STORMWATER DRAIN NETWORK - CLUE BLOCKS AS PROXY
    // 1 - CLUE BLOCKS
    function loadStormwaterDrainsStory() {
        layersList = ["Show stormwater drains"];
        map.addLayer({
            id: "Show stormwater drains",
            source: "stormwater drains",
            "source-layer": "CDX_stormwaterDrains-bm7w6h",
            type: "line",
            paint: {
                "line-color": "#9cdef0",
                "line-width": 1.5,
                "line-opacity": 0.9,
            },
        });
        document.getElementById("legend").innerHTML = `
        <div style='text-align: left'>        
        <div class='legendLabel'>Stormwater Drains</div>
        </div>`;
    }
    statesList.push(loadStormwaterDrainsStory); // [0],1
    stateNamesList.push("loadStormwaterDrainsStory");

    // 5 - STORMWATER SENSOR LOCATIONS
    function loadStormwaterLocationStory() {
        layersList = ["Show stormwater sensor locations", "Show stormwater sensor location rings"];
        map.addLayer({
            id: "Show stormwater sensor locations",
            source: "stormwater sensors",
            "source-layer": "CDX_CityDNA_stormwaterSensors",
            type: "circle",
            paint: {
                "circle-color": "#9cdef0",
                "circle-radius": 10,
                "circle-opacity": 1,
            },
        });
        map.addLayer({
            id: "Show stormwater sensor location rings",
            source: "stormwater sensors",
            "source-layer": "CDX_CityDNA_stormwaterSensors",
            type: "circle",
            paint: {
                "circle-color": 'rgba(0,0,0,0)',
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 2,
                "circle-radius": 16,
                "circle-opacity": 1,
            },
        });
    }
    statesList.push(loadStormwaterLocationStory);
    stateNamesList.push("loadStormwaterLocationStory");

    // This is the data that defines each stormwater drain when operating normally. 
    // BE AWARE THAT EDITING THIS DATA WILL AFFECT MULTIPLE LAYERS AND ACTIONS
    // Ensure the waterLevel arrays loop smoothly (ie, are a multiple of tidal intervals at 12.5 hours)
    const swDrainSource = [
        {
            drainID: "SW1",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                0.01, 0.03, 0.06, 0.11, 0.18, 0.26, 0.35, 0.45, 0.55, 0.67, 0.79, 0.91, 1.04, 1.16, 1.28, 1.40, 1.51, 1.62, 1.71, 1.79, 1.86, 1.92, 1.96, 1.99, 2.00, 1.99, 1.97, 1.93, 1.88, 1.81, 1.73, 1.64, 1.54, 1.43, 1.32, 1.19, 1.07, 0.95, 0.82, 0.70, 0.58, 0.47, 0.37, 0.28, 0.20, 0.13, 0.08, 0.04, 0.01, 0.00,
            ],
        },
        {
            drainID: "SW2",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                0.21, 0.23, 0.26, 0.31, 0.38, 0.46, 0.55, 0.65, 0.75, 0.87, 0.99, 1.11, 1.24, 1.36, 1.48, 1.60, 1.71, 1.82, 1.91, 1.99, 2.06, 2.12, 2.16, 2.19, 2.20, 2.19, 2.17, 2.13, 2.08, 2.01, 1.93, 1.84, 1.74, 1.63, 1.52, 1.39, 1.27, 1.15, 1.02, 0.90, 0.78, 0.67, 0.57, 0.48, 0.40, 0.33, 0.28, 0.24, 0.21, 0.20,
            ],
        },
        {
            drainID: "SW3",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                0.81, 0.83, 0.86, 0.91, 0.98, 1.06, 1.15, 1.25, 1.35, 1.47, 1.59, 1.71, 1.84, 1.96, 2.08, 2.20, 2.31, 2.42, 2.51, 2.59, 2.66, 2.72, 2.76, 2.79, 2.80, 2.79, 2.77, 2.73, 2.68, 2.61, 2.53, 2.44, 2.34, 2.23, 2.12, 1.99, 1.87, 1.75, 1.62, 1.50, 1.38, 1.27, 1.17, 1.08, 1.00, 0.93, 0.88, 0.84, 0.81, 0.80,
            ],
        },
        {
            drainID: "SW4",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                0.11, 0.13, 0.16, 0.21, 0.28, 0.36, 0.45, 0.55, 0.65, 0.77, 0.89, 1.01, 1.14, 1.26, 1.38, 1.50, 1.61, 1.72, 1.81, 1.89, 1.96, 2.02, 2.06, 2.09, 2.10, 2.09, 2.07, 2.03, 1.98, 1.91, 1.83, 1.74, 1.64, 1.53, 1.42, 1.29, 1.17, 1.05, 0.92, 0.80, 0.68, 0.57, 0.47, 0.38, 0.30, 0.23, 0.18, 0.14, 0.11, 0.10,
            ],
        },
        {
            drainID: "SW5",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                0.91, 0.93, 0.96, 1.01, 1.08, 1.16, 1.25, 1.35, 1.45, 1.57, 1.69, 1.81, 1.94, 2.06, 2.18, 2.30, 2.41, 2.52, 2.61, 2.69, 2.76, 2.82, 2.86, 2.89, 2.90, 2.89, 2.87, 2.83, 2.78, 2.71, 2.63, 2.54, 2.44, 2.33, 2.22, 2.09, 1.97, 1.85, 1.72, 1.60, 1.48, 1.37, 1.27, 1.18, 1.10, 1.03, 0.98, 0.94, 0.91, 0.90,
            ],
        },
        {
            drainID: "SW6",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                1.81, 1.83, 1.86, 1.91, 1.98, 2.06, 2.15, 2.25, 2.35, 2.47, 2.59, 2.71, 2.84, 2.96, 3.08, 3.20, 3.31, 3.42, 3.51, 3.59, 3.66, 3.72, 3.76, 3.79, 3.80, 3.79, 3.77, 3.73, 3.68, 3.61, 3.53, 3.44, 3.34, 3.23, 3.12, 2.99, 2.87, 2.75, 2.62, 2.50, 2.38, 2.27, 2.17, 2.08, 2.00, 1.93, 1.88, 1.84, 1.81, 1.80,
            ],
        },
        {
            drainID: "SW7",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                1.41, 1.43, 1.46, 1.51, 1.58, 1.66, 1.75, 1.85, 1.95, 2.07, 2.19, 2.31, 2.44, 2.56, 2.68, 2.80, 2.91, 3.02, 3.11, 3.19, 3.26, 3.32, 3.36, 3.39, 3.40, 3.39, 3.37, 3.33, 3.28, 3.21, 3.13, 3.04, 2.94, 2.83, 2.72, 2.59, 2.47, 2.35, 2.22, 2.10, 1.98, 1.87, 1.77, 1.68, 1.60, 1.53, 1.48, 1.44, 1.41, 1.40,
            ],
        },
        {
            drainID: "SW8",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                0.31, 0.33, 0.36, 0.41, 0.48, 0.56, 0.65, 0.75, 0.85, 0.97, 1.09, 1.21, 1.34, 1.46, 1.58, 1.70, 1.81, 1.92, 2.01, 2.09, 2.16, 2.22, 2.26, 2.29, 2.30, 2.29, 2.27, 2.23, 2.18, 2.11, 2.03, 1.94, 1.84, 1.73, 1.62, 1.49, 1.37, 1.25, 1.12, 1.00, 0.88, 0.77, 0.67, 0.58, 0.50, 0.43, 0.38, 0.34, 0.31, 0.30,
            ],
        },
        {
            drainID: "SW9",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                0.41, 0.43, 0.46, 0.51, 0.58, 0.66, 0.75, 0.85, 0.95, 1.07, 1.19, 1.31, 1.44, 1.56, 1.68, 1.80, 1.91, 2.02, 2.11, 2.19, 2.26, 2.32, 2.36, 2.39, 2.40, 2.39, 2.37, 2.33, 2.28, 2.21, 2.13, 2.04, 1.94, 1.83, 1.72, 1.59, 1.47, 1.35, 1.22, 1.10, 0.98, 0.87, 0.77, 0.68, 0.60, 0.53, 0.48, 0.44, 0.41, 0.40,
            ],
        },
        {
            drainID: "SW10",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                1.41, 1.43, 1.46, 1.51, 1.58, 1.66, 1.75, 1.85, 1.95, 2.07, 2.19, 2.31, 2.44, 2.56, 2.68, 2.80, 2.91, 3.02, 3.11, 3.19, 3.26, 3.32, 3.36, 3.39, 3.40, 3.39, 3.37, 3.33, 3.28, 3.21, 3.13, 3.04, 2.94, 2.83, 2.72, 2.59, 2.47, 2.35, 2.22, 2.10, 1.98, 1.87, 1.77, 1.68, 1.60, 1.53, 1.48, 1.44, 1.41, 1.40,
            ],
        },
        {
            drainID: "SW11",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                1.51, 1.53, 1.56, 1.61, 1.68, 1.76, 1.85, 1.95, 2.05, 2.17, 2.29, 2.41, 2.54, 2.66, 2.78, 2.90, 3.01, 3.12, 3.21, 3.29, 3.36, 3.42, 3.46, 3.49, 3.50, 3.49, 3.47, 3.43, 3.38, 3.31, 3.23, 3.14, 3.04, 2.93, 2.82, 2.69, 2.57, 2.45, 2.32, 2.20, 2.08, 1.97, 1.87, 1.78, 1.70, 1.63, 1.58, 1.54, 1.51, 1.50,
            ],
        },
        {
            drainID: "SW12",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                0.61, 0.63, 0.66, 0.71, 0.78, 0.86, 0.95, 1.05, 1.15, 1.27, 1.39, 1.51, 1.64, 1.76, 1.88, 2.00, 2.11, 2.22, 2.31, 2.39, 2.46, 2.52, 2.56, 2.59, 2.60, 2.59, 2.57, 2.53, 2.48, 2.41, 2.33, 2.24, 2.14, 2.03, 1.92, 1.79, 1.67, 1.55, 1.42, 1.30, 1.18, 1.07, 0.97, 0.88, 0.80, 0.73, 0.68, 0.64, 0.61, 0.60,
            ],
        },
        {
            drainID: "SW13",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                1.71, 1.73, 1.76, 1.81, 1.88, 1.96, 2.05, 2.15, 2.25, 2.37, 2.49, 2.61, 2.74, 2.86, 2.98, 3.10, 3.21, 3.32, 3.41, 3.49, 3.56, 3.62, 3.66, 3.69, 3.70, 3.69, 3.67, 3.63, 3.58, 3.51, 3.43, 3.34, 3.24, 3.13, 3.02, 2.89, 2.77, 2.65, 2.52, 2.40, 2.28, 2.17, 2.07, 1.98, 1.90, 1.83, 1.78, 1.74, 1.71, 1.70,
            ],
        },
        {
            drainID: "SW14",
            status: "clear",
            trigger: false,
            blockageTimer: 0,
            waterLevel: [
                1.21, 1.23, 1.26, 1.31, 1.38, 1.46, 1.55, 1.65, 1.75, 1.87, 1.99, 2.11, 2.24, 2.36, 2.48, 2.60, 2.71, 2.82, 2.91, 2.99, 3.06, 3.12, 3.16, 3.19, 3.20, 3.19, 3.17, 3.13, 3.08, 3.01, 2.93, 2.84, 2.74, 2.63, 2.52, 2.39, 2.27, 2.15, 2.02, 1.90, 1.78, 1.67, 1.57, 1.48, 1.40, 1.33, 1.28, 1.24, 1.21, 1.20,
            ],
        },
    ];

    // 6 - STORMWATER SENSOR DEMO DATA
    function loadStormwaterDataStory() {
        layersList = ["Show demo stormwater sensors", "Show demo stormwater sensor location rings"];
        map.addLayer({
            id: "Show demo stormwater sensors",
            source: "stormwater sensors",
            "source-layer": "CDX_CityDNA_stormwaterSensors",
            type: "circle",
            paint: {
                "circle-color": "#9cdef0",
                "circle-radius": ['match', ['get', 'name'],
                    'SW1', (swDrainLive[0].waterLevel[0] * 3 + 6),
                    'SW2', (swDrainLive[1].waterLevel[0] * 3 + 6),
                    'SW3', (swDrainLive[2].waterLevel[0] * 3 + 6),
                    'SW4', (swDrainLive[3].waterLevel[0] * 3 + 6),
                    'SW5', (swDrainLive[4].waterLevel[0] * 3 + 6),
                    'SW6', (swDrainLive[5].waterLevel[0] * 3 + 6),
                    'SW7', (swDrainLive[6].waterLevel[0] * 3 + 6),
                    'SW8', (swDrainLive[7].waterLevel[0] * 3 + 6),
                    'SW9', (swDrainLive[8].waterLevel[0] * 3 + 6),
                    'SW10', (swDrainLive[9].waterLevel[0] * 3 + 6),
                    'SW11', (swDrainLive[10].waterLevel[0] * 3 + 6),
                    'SW12', (swDrainLive[11].waterLevel[0] * 3 + 6),
                    'SW13', (swDrainLive[12].waterLevel[0] * 3 + 6),
                    'SW14', (swDrainLive[13].waterLevel[0] * 3 + 6),
                    12
                ],
                "circle-opacity": 1,
            },
        });
        map.addLayer({
            id: "Show demo stormwater sensor location rings",
            source: "stormwater sensors",
            "source-layer": "CDX_CityDNA_stormwaterSensors",
            type: "circle",
            paint: {
                "circle-color": 'rgba(0,0,0,0)',
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 2,
                "circle-radius": 16,
                "circle-opacity": 1,
            },
        });

        let countDemoIntervals = 0;
        let arrayCounter = 0;


        let demoWeeklyAnimation = setInterval(() => {
            console.log('demo animation state', countDemoIntervals);
            arrayCounter = countDemoIntervals % swDrainLive[0].waterLevel.length;

            map.setPaintProperty('Show demo stormwater sensors', 'circle-radius', ['match', ['get', 'name'],
                'SW1', (swDrainLive[0].waterLevel[arrayCounter] * 3 + 6),
                'SW2', (swDrainLive[1].waterLevel[arrayCounter] * 3 + 6),
                'SW3', (swDrainLive[2].waterLevel[arrayCounter] * 3 + 6),
                'SW4', (swDrainLive[3].waterLevel[arrayCounter] * 3 + 6),
                'SW5', (swDrainLive[4].waterLevel[arrayCounter] * 3 + 6),
                'SW6', (swDrainLive[5].waterLevel[arrayCounter] * 3 + 6),
                'SW7', (swDrainLive[6].waterLevel[arrayCounter] * 3 + 6),
                'SW8', (swDrainLive[7].waterLevel[arrayCounter] * 3 + 6),
                'SW9', (swDrainLive[8].waterLevel[arrayCounter] * 3 + 6),
                'SW10', (swDrainLive[9].waterLevel[arrayCounter] * 3 + 6),
                'SW11', (swDrainLive[10].waterLevel[arrayCounter] * 3 + 6),
                'SW12', (swDrainLive[11].waterLevel[arrayCounter] * 3 + 6),
                'SW13', (swDrainLive[12].waterLevel[arrayCounter] * 3 + 6),
                'SW14', (swDrainLive[13].waterLevel[arrayCounter] * 3 + 6),
                12
            ]);

            countDemoIntervals += 1;

            if (countDemoIntervals == 200) { // length of animation (*150/1000 to convert to seconds; 200 is 30")
                clearInterval(demoWeeklyAnimation);
            }
        }, 150);


    };


    statesList.push(loadStormwaterDataStory);
    stateNamesList.push("loadStormwaterDataStory");


    // 7 - SOUTHBANK STORMWATER SENSOR DEMO DATA
    function loadSouthbankStormwaterDataStory() {
        layersList = ["Show southbank sensor location", "Show southbank alert icon", "Show southbank location ring"];
        map.addLayer({
            id: "Show southbank sensor location",
            source: "stormwater sensors",
            "source-layer": "CDX_CityDNA_stormwaterSensors",
            type: "circle",
            paint: {
                "circle-color": "#9cdef0",
                "circle-radius": 18,
                "circle-opacity": 1,
            },
            filter: [
                "match",
                ["get", "name"],
                "SW9",
                true,
                false,
            ],

        });

        map.addLayer({
            id: "Show southbank location ring",
            source: "stormwater sensors",
            "source-layer": "CDX_CityDNA_stormwaterSensors",
            type: "circle",
            paint: {
                "circle-color": 'rgba(0,0,0,0)',
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 2,
                "circle-radius": 16,
                "circle-opacity": 1,
            },
            filter: [
                "match",
                ["get", "name"],
                "SW9",
                true,
                false,
            ],
        });


        map.addLayer({
            id: "Show southbank alert icon",
            source: "stormwater game QRs", //this layer offsets the icons to clear/flat space on the 3d model
            "source-layer": "CDX_CityDNA_game_stormwaterSenso",
            type: "symbol",
            layout: {
                "icon-image": 'alertIcon',
                "icon-size": 0.5,
                // This layer is not visible initially.
                // It will be updated to 'visible' by blockedDrain()
                // 'visibility': 'none',
                'visibility': 'none',
            },
            filter: [
                "match",
                ["get", "name"],
                "SW3", // the nearest flat space for the icon 
                true,
                false,
            ],
        });

        let southbankWaterLevelDemo = [
            1.21, 1.23, 1.26, 1.31, 1.38, 1.46, 1.55, 1.65, 1.75, 1.87,
            1.99, 2.11, 2.24, 2.36, 2.48, 2.60, 2.71, 2.82, 2.91, 2.99,
            3.06, 3.12, 3.16, 3.19, 3.20,
            3.19, 3.17, 3.13, 3.08, 3.01, 2.93, 2.84, 2.74, 2.63, 2.52,
            2.39, 2.27, 2.15, 2.02, 1.90, 1.78, 1.67, 1.57, 1.48, 1.40,
            1.33, 1.28, 1.24, 1.21, 1.20,
            1.21, 1.23, 1.26, 1.31, 1.38, 1.46, 1.55, 1.65, 1.75, 1.87,
            1.99, 2.11, 2.24, 2.36, 2.48, 2.60, 2.71, 2.82, 2.91, 2.99,
            3.06, 3.12, 3.18, 3.22, 3.26, 3.30, 3.34, 3.38, 3.42, 3.46,
            3.50, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.50, 5.75, 6.00, 6.25,
            6.50, 6.75, 7.00, 7.25, 7.50, 7.7, 7.9, 8.1, 8.3, 8.50, 8.7, 8.9,
            9.00, 9.2, 9.35, 9.40, 9.55, 9.7, 9.85,
            10.00, 10.1, 10.2, 10.3, 10.4, 10.50, 10.6, 10.7, 10.8, 10.9,
            11.00, 11.1, 11.2, 11.3, 11.4, 11.50, 11.6, 11.7, 11.58, 11.9,
            12.00, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9,
            13.00, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9,
            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
        ];


        let countGameIntervals = 0;
        const maxGameLength = 200;
        let globalStormwaterStep;

        let southbankStormwaterAnimation = setInterval(() => {
            console.log("gameInterval is ", countGameIntervals);
            globalStormwaterStep = (countGameIntervals) % southbankWaterLevelDemo.length;

            map.setPaintProperty("Show southbank sensor location", "circle-radius", (southbankWaterLevelDemo[globalStormwaterStep] * 2 + 8))

            // southbankWaterLevelDemo[globalStormwaterStep] = southbankWaterLevelDemo[globalStormwaterStep] + 0.6;

            if (countGameIntervals == 100) {
                map.setPaintProperty("Show southbank sensor location", "circle-color", "#edea3b");
                map.setLayoutProperty("Show southbank alert icon", 'visibility', 'visible');
            };
            if (countGameIntervals == 150) {
                map.setPaintProperty("Show southbank sensor location", "circle-color", "#eb962f");
            };
            if (countGameIntervals == 190) {
                map.setPaintProperty("Show southbank sensor location", "circle-color", "#eb2f2f");
                map.setLayoutProperty("Show southbank alert icon", 'icon-image', 'brokenIcon');
            };

            if (countGameIntervals == maxGameLength) {
                clearInterval(southbankStormwaterAnimation);
            };
            countGameIntervals += 1;

        }, 150);
    };
    statesList.push(loadSouthbankStormwaterDataStory);
    stateNamesList.push("loadSouthbankStormwaterDataStory");



    //////////////////////
    //  STORMWATER GAME //
    //////////////////////

    // GLOBAL VARIABLES

    // Variables controlling game timing
    const animationRate = 150; // ADJUST THIS to set the length of an 'interval', in milliseconds. 200 is good.
    const gameLength = 30; // ADJUST THIS to set the length of overall gameplay, in seconds
    const gameTotalIntervals = (gameLength / animationRate) * 1000; // number of intervals in game
    let globalStep = -1; // Start at -1 so that first increment is 0

    // Variables to manage the drains and related data
    // ONLY ADJUST THIS if there are more than 14 stormwater drains on the map.
    // This MUST match the number and names of ALL the features in the mapbox layer
    const drainIdArray = [
        "SW1",
        "SW2",
        "SW3",
        "SW4",
        "SW5",
        "SW6",
        "SW7",
        "SW8",
        // "SW9",
        // "SW10",
        // "SW11",
        // "SW12",
        // "SW13",
        // "SW14",
    ];



    // On initiation, clone swDrainSource data into swDrainLive without reference to the original.
    // This is the data that will be updated in response to gameplay.
    let swDrainLive = JSON.parse(JSON.stringify(swDrainSource));

    // Variables to manage updating the symbology of the drains
    const amplitudeMultiplier = 3.0; // ADJUST THIS to set the size of the radius at highest tide. (2.8)
    const amplitudeBaseline = 15; //ADJUST THIS to set the size of the radius at lowest-tide. (20)
    const floodTimeLimit = 50; // ADJUST THIS to set how long between a blockage and a flood. (25)
    const thresholdIncrement = 4; // ADJUST THIS to set how long it takes to move between alert thresholds (3)
    // also consider making thresholdIncrement an array to set individual tolerances for each drain.
    const incrementValue = 0.15; // ADJUST THIS to set how quickly the flood level rises.

    // Construct four arrays for the waterLevel thresholds where each drain will change colour.
    // Each drain will be different, so this value is based on their high-tide value.
    let alertThresholdBlue = [];
    let alertThresholdYellow = [];
    let alertThresholdOrange = [];
    let alertThresholdRed = [];
    let alertThresholdFlooded = [];

    for (index in swDrainSource) {
        // get the highest tide value (index 25) from the source file and apply standard conversion
        const blueThreshold = swDrainSource[index].waterLevel[25] * amplitudeMultiplier + amplitudeBaseline + thresholdIncrement; //take the high tide and apply multipliers then add 'thresholdIncrement' to allow for some overflow before triggering orange. 
        const yellowThreshold = blueThreshold + thresholdIncrement;
        const orangeThreshold = yellowThreshold + thresholdIncrement;
        const redThreshold = orangeThreshold + thresholdIncrement;
        const floodedThreshold = redThreshold + thresholdIncrement;

        // add to the arrays
        alertThresholdBlue.push(blueThreshold);
        alertThresholdYellow.push(yellowThreshold);
        alertThresholdOrange.push(orangeThreshold);
        alertThresholdRed.push(redThreshold);
        alertThresholdFlooded.push(floodedThreshold);
    }

    // Variables for updating legend and instructions
    const clockDisplay = [
        "Midnight",
        "1 AM",
        "2 AM",
        "3 AM",
        "4 AM",
        "5 AM",
        "6 AM",
        "7 AM",
        "8 AM",
        "9 AM",
        "10 AM",
        "11 AM",
        "noon",
        "1 PM",
        "2 PM",
        "3 PM",
        "4 PM",
        "5 PM",
        "6 PM",
        "7 AM",
        "8 AM",
        "9 PM",
        "10 PM",
        "11 PM",
    ];

    const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbw4lkVzzZcRT6Cd_M7UQKKS4OfF2NPXiKPUuIMlfNlkiVKIluuO7NBYCtFIzEofRvM6QQ/exec'
        + '?origin=table'

    const qrCodeUrls = [
        'https://live.staticflickr.com/65535/54162401719_982b54ba7c.jpg', //QR1
        'https://live.staticflickr.com/65535/54162362528_2b69234efc.jpg', //QR2
        'https://live.staticflickr.com/65535/54162544515_28c52a6ebc.jpg', //QR3
        'https://live.staticflickr.com/65535/54162088081_55bc6fcb90.jpg', //QR4
        'https://live.staticflickr.com/65535/54162362393_ed2d60de2c.jpg', //QR5
        'https://live.staticflickr.com/65535/54162544415_ce05e47298.jpg', //QR6
        'https://live.staticflickr.com/65535/54162401634_2a5ee8884f.jpg', //QR7
        'https://live.staticflickr.com/65535/54162088031_ae10853f76.jpg', //QR8
        // 'https://live.staticflickr.com/65535/54162544395_4e4d9fc4d0.jpg',
        // 'https://live.staticflickr.com/65535/54162088016_e09f4ff005.jpg',
        // 'https://live.staticflickr.com/65535/54161215572_df444fb9f1.jpg'
    ]


    // 8 - STORMWATER SENSOR GAME DEMO
    function loadStormwaterGameDemoStory() {
        layersList = ["Show stormwater game sensor locations", 'Show drain id numbers', "Show game sensor location rings"];
        map.addLayer({
            id: "Show stormwater game sensor locations",
            source: "stormwater game",
            "source-layer": "CDX_CityDNA_game_stormwaterSenso",
            type: "circle",
            paint: {
                "circle-color": "#9cdef0",
                "circle-radius": 18,
                "circle-opacity": 1,
            },
        });

        map.addLayer({
            id: 'Show drain id numbers',
            source: "stormwater game",
            "source-layer": "CDX_CityDNA_game_stormwaterSenso",
            type: "symbol",
            paint: {
                'text-color': '#000000',
            },
            layout: {
                "text-field": [
                    'format',
                    ['upcase', ['slice', ['get', 'name'], 2]],
                    { 'font-scale': 1.8 }
                ],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],

                // "icon-offset": qrOffsetList[index], //right, down
                // This layer is not visible initially.
                // It will be updated to 'visible' by blockedDrain()
                // 'visibility': 'none',
                'visibility': 'visible',
            },
        });

        map.addLayer({
            id: "Show game sensor location rings",
            source: "stormwater game",
            "source-layer": "CDX_CityDNA_game_stormwaterSenso",
            type: "circle",
            paint: {
                "circle-color": 'rgba(0,0,0,0)',
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 2,
                "circle-radius": 24,
                "circle-opacity": 1,
            },
        });

    }
    statesList.push(loadStormwaterGameDemoStory);
    stateNamesList.push("loadStormwaterGameDemoStory");





    // 9 - STORMWATER GAME
    // Add the layers to the map using the usual CityDNA method

    function loadStormwaterGame() {
        // Create arrays with the names of the sensors which correspond to
        // the 'name' field in the mapbox data source, which we will use througout.
        restoreBackgroundLayer();

        let layersSubListCircles = drainIdArray;

        let layersSubListSymbols = [];
        for (const index in drainIdArray) {
            layersSubListSymbols.push(drainIdArray[index] + "symbol");
        };

        let layersSubListIcons = [];
        for (const index in drainIdArray) {
            layersSubListIcons.push(drainIdArray[index] + 'Icon');
        };

        // We need a layersList array so that Presentation Mode can turn all the layers off at the end of the game.
        layersList = layersSubListCircles.concat(layersSubListSymbols).concat(layersSubListIcons);

        // Add 8 new CIRCLE layers, one for each drain.
        // Note that this adds a new drains at every location, but renders each drain only once (one per layer).
        // We will use this layer to place a red circle over a broken drain.
        for (const index in layersSubListCircles) {
            map.addLayer({
                id: layersSubListCircles[index],
                source: "stormwater game",
                "source-layer": "CDX_CityDNA_game_stormwaterSenso",
                type: "circle",
                paint: {
                    "circle-color": "#9cdef0",
                    // 'circle-radius': 3,
                    "circle-radius":
                        swDrainLive[index].waterLevel[0] * amplitudeMultiplier +
                        amplitudeBaseline,
                    "circle-opacity": 1,
                },
                layout: {
                    visibility: "visible", // we will set this to 'none' if this drain floods out
                },
                filter: [
                    "match",
                    ["get", "name"],
                    layersSubListCircles[index],
                    true,
                    false,
                ],
            });
        }

        // Add a new SYMBOL layer for each drain.
        // This will carry the alert symbols and the 'broken' images.


        for (const index in layersSubListIcons) {
            map.addLayer({
                id: layersSubListIcons[index],
                source: "stormwater game QRs", //this layer offsets the icons to clear/flat space on the 3d model
                "source-layer": "CDX_CityDNA_game_stormwaterSenso",
                type: "symbol",
                layout: {
                    "icon-image": 'alertIcon',
                    "icon-size": 0.5,
                    // This layer is not visible initially.
                    // It will be updated to 'visible' by blockedDrain()
                    // 'visibility': 'none',
                    'visibility': 'none',
                },
                filter: [
                    "match",
                    ["get", "name"],
                    layersSubListCircles[index], // use SubListCircles list as it matches the feature names in the source layer
                    true,
                    false,
                ],
            });
        };


        for (const index in layersSubListSymbols) {
            map.addLayer({
                id: layersSubListSymbols[index],
                source: "stormwater game",
                "source-layer": "CDX_CityDNA_game_stormwaterSenso",
                type: "circle",
                paint: {
                    "circle-stroke-color": "#FFFFFF",
                    "circle-radius": 50,
                    "circle-stroke-width": 2,
                    "circle-color": "rgba(0,0,0,0)",
                },
                layout: {
                    // This layer is not visible initially.
                    // It will be updated to 'visible' by blockedDrain()
                    visibility: "none",
                },
                filter: [
                    "match",
                    ["get", "name"],
                    layersSubListCircles[index],
                    true,
                    false,
                ],
            });
        }

        // Add a trigger to simulate the user clicking on the 'unblock drain' button.
        // Set the SYMBOLS layer to react to a click.
        // I'm using the symbols layer so that you can only interact with a blocked drain,
        // which simulates the game scenario (only blocked drains have alert icons).
        for (const index in layersSubListSymbols) {
            map.on("click", layersSubListSymbols[index], (e) => {
                // use URL query ID to determine blockID
                const drainID = e.features[0].properties.name;
                console.log(`You clicked on ${drainID}`);

                // use blockID to get the swDrain index then update the swDrainsLive spreadsheet
                const drainIdIndex = drainIdArray.indexOf(drainID);
                swDrainLive[drainIdIndex].trigger = true;
            });
        }

        // remove the dimmable overlay
        restoreBackgroundLayer();

        // Let's get this party started!
        startGame();
    }
    statesList.push(loadStormwaterGame);
    stateNamesList.push("loadStormwaterGame");

    // GAME FUNCTIONS

    function startGame() {
        console.log("Game started");
        // restoreBackgroundLayer(); //not working?
        // let responseText = '';
        let firstPosition = 0;
        let timeElapsed = ''
        let secondPosition = 0;
        let countGameIntervals = -1;

        let gameAnimation = setInterval(() => {
            countGameIntervals += 1; // keep track of game length
            console.log(`Game interval ${countGameIntervals}`);
            globalStep = (globalStep + 1) % swDrainSource[0].waterLevel.length; // this will loop the game through the available waterLevel entries until endGame(gameAnimation) is called

            if (countGameIntervals == gameTotalIntervals) {
                endGame(gameAnimation); // note that we still finish this pass over the below code before ending
            }


            // CHECK DATA FROM GOOGLE SHEET //

            //  Once per second, check the spreadsheet for any drains cleared by players, then reset the spreadsheet
            if (countGameIntervals % ((animationRate / gameLength) * 2) == 0) { // eg, every 2 seconds
                fetch(spreadsheetUrl)
                    .then((response) => {
                        response = response.text();
                        // responseText = responseText.toString();
                        // console.log('responseText length:', responseText.length)
                        return response;
                    })
                    .then((data) => {
                        console.log(data)
                        data = data.toString();
                        // check returned text for 'userCleared' status

                        firstPosition = data.indexOf('userCleared')
                        if (firstPosition != -1) {
                            firstPosition = firstPosition - 4 //count back to the start of drainID 'SWx'
                            let userDrainId = data.substr(firstPosition, 3);
                            console.log('userDrainId:', userDrainId)

                            firstPosition = firstPosition + 14 //count forward to time value
                            timeElapsed = data.charAt(firstPosition);
                            console.log('time elapsed is', timeElapsed)

                            //update the data at swDrainLive[drainIdIndex].status
                            clearDrain(userDrainId);


                            // secondPosition = data.indexOf('userCleared', firstPosition+1)
                            // if (secondPosition != -1) {
                            //     secondPosition = secondPosition - 2 //count back to number of drainID
                            //     drainIdIndex = Number(data.charAt(secondPosition)) - 1;

                            //     secondPosition = secondPosition + 14 //count forward to time value
                            //     timeElapsed = data.charAt(secondPosition);

                            //     //update the data
                            // }
                        }
                    })
                    .catch(error => console.error('Error with fetch():', error));
                console.log('ping-spreadsheet')


            }

            // ALTERNATIVE METHOD
            // const googleAPIKey = 'AIzaSyBzJwy_PUnw9-uunEXmuEn6GTrOXGH5KRU'; // Replace with your API key
            // const spreadsheetId = '1Zx3CyyEMYr20QdV1hA6t2mKijNoTWeWZ9WmDZwKunEw'; // Replace with your spreadsheet ID
            // const sheetName = 'sensorStatus!A1:C14'; // Replace with your sheet name
            // const sheetSource = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${googleAPIKey}`

            // fetch(sheetSource)
            //     .then(response => response.json())
            //     .then(data => console.log(data.values))
            //     .catch(error => console.error('Error:', error));



            // Update legend to show day/time for this interval
            // TO DO: create game countdown timer
            // TO DO, LOW PRIORITY: also calculate day / date etc from globalStep
            let clockDisplayReadout = clockDisplay[globalStep % clockDisplay.length];
            let dayIncrement = 0; 
            if (clockDisplayReadout == "Midnight") {
                dayIncrement += 1;
            };
            document.getElementById("legend").innerHTML = `<br> Stormwater drain sensors<br><br> ${18 + dayIncrement} December 2030 ${clockDisplayReadout}`;

            // Are any drains due to block this interval?
            // Manually set the blockage schedule

            if ((countGameIntervals - 50) % 65 === 0) {
                //every 35 sec
                blockDrain("SW1");
            };
            if ((countGameIntervals - 30) % 86 === 0) {
                //every 35 sec
                blockDrain("SW7");
            };
            if ((countGameIntervals - 15) % 77 === 0) {
                //every 35 sec
                blockDrain("SW2");
            };
            if ((countGameIntervals + 1) % 108 === 0) {
                //every 35 sec
                blockDrain("SW4");
            };
            if ((countGameIntervals + 1) % 59 === 0) {
                //every 35 sec
                blockDrain("SW5");
            };
            if ((countGameIntervals + 1) % 70 === 0) {
                //every 35 sec
                blockDrain("SW6");
            };
            if ((countGameIntervals + 1) % 81 === 0) {
                //every 35 sec
                blockDrain("SW3");
            };
            if ((countGameIntervals + 1) % 92 === 0) {
                //every 35 sec
                blockDrain("SW8");
            };


            // PREPARE THE LIVE DATA
            // Check the status of all the drains and ensure the values for their
            // water levels is up to date in swDrainLive

            // Loop through swDrainLive.status
            for (const index in swDrainLive) {
                const thisDrain = swDrainLive[index];
                // if status is blocked

                if (thisDrain.status == "blocked") {
                    // if a blocked drain has been triggered then clear it.
                    if (thisDrain.trigger == true) {
                        // the drain is triggered if a player has succeeded in unblocking the drain
                        // and has overwritted the code in the spreadsheet
                        clearDrain(thisDrain.drainID);
                        // no need to reset the trigger to false as this happens in clearDrain()
                    }

                    // if it has not been triggered, then update the blockage timer
                    thisDrain.blockageTimer += 1;

                    // if the blockage timer has reached the threshold for flooding, flood the drain
                    if (thisDrain.blockageTimer == floodTimeLimit) {
                        thisDrain.status = "flooded";
                        floodDrain(thisDrain.drainID);
                    }
                }
            }

            // SAVE VALUES TO UPDATE SYMBOLOGY

            let swSymbolRadiusValues = [];
            let swSymbolColorValues = [];
            for (const index in swDrainLive) {
                const thisDrain = swDrainLive[index];

                const thisDrainWaterLevel = thisDrain.waterLevel[globalStep];
                // calculate the correct radius for this particular drain at this moment
                const thisCircleRadius =
                    thisDrainWaterLevel * amplitudeMultiplier + amplitudeBaseline;
                // calculate the correct color for this particular drain at this moment
                // check that radius against the alert thresholds
                let thisCircleColor = "";
                if (thisCircleRadius <= alertThresholdBlue[index]) {
                    thisCircleColor = "#9cdef0"; //blue prev #3277a8
                } else if (thisCircleRadius <= alertThresholdYellow[index]) {
                    thisCircleColor = "#edea3b"; //yellow
                } else if (thisCircleRadius <= alertThresholdOrange[index]) {
                    thisCircleColor = "#eb962f"; //orange
                } else {
                    thisCircleColor = "#eb2f2f"; //red
                }

                swSymbolRadiusValues.push(thisCircleRadius);
                swSymbolColorValues.push(thisCircleColor);
            }

            // UPDATE THE SYMBOLOGY USING THE SAVED VALUES
            // Loop through all the drain circle layers
            for (const index in drainIdArray) {
                const thisDrainID = drainIdArray[index];
                map.setPaintProperty(
                    thisDrainID,
                    "circle-radius",
                    swSymbolRadiusValues[index]
                );
                map.setPaintProperty(
                    thisDrainID,
                    "circle-color",
                    swSymbolColorValues[index]
                );
            }

            // Now loop through all the symbol layers
        }, animationRate); //set the rate of refresh for the animation
    }

    function blockDrain(drainID) {
        // use drainID to get appropriate index
        const drainIdIndex = drainIdArray.indexOf(drainID);

        // We only want to blockDrain() if the drain is currently clear.
        // If it's 'flooded' or already 'blocked' we should leave it alone.
        if (swDrainLive[drainIdIndex].status == "clear") {
            // update drain status to 'blocked'
            swDrainLive[drainIdIndex].status = "blocked";
            console.log(
                `Drain ${drainID} is BLOCKED: ${swDrainLive[drainIdIndex].status}`
            );

            // update drain water level values in swDrainLive
            // I'm using the json but it will need to be the google sheet
            // loop through the swDrainLive[drainIDIndex].waterLevel array, starting at the index of globalStep (not gameIntervals)
            // starting at the right spot, start adding 1, 2, 3, to the live waterLevel (the multiplier and baseline will still be added later)
            // handle the situation where the game is looping back to the start,
            // ie, start at index [globalStep] go to end of array, then go to start and work up to [globalStep] then stop.
            for (const index in swDrainLive[drainIdIndex].waterLevel) {
                const indexNumber = Number(index); //convert string to number so we can do calculations

                // We will use the index as the base for adding water to the waterLevel, so that we can add cumulatively more to each value, to simulate a rising flood while retaining the tidal pulse.
                // Apply a conversion factor to indexNumber to make it appropriate as a water level increase
                const thisIncrementValue = indexNumber * incrementValue; // the usual range of a drain is 0-2.0, we want that to double in about 10 seconds

                // Establish which index of waterLevel the game is currently reading
                const waterLevelToUpdate =
                    (indexNumber + globalStep) %
                    swDrainLive[drainIdIndex].waterLevel.length;

                // Update the data from this point, then loop back to the start of the array and finish where we started.
                // console.log(`globalStep: ${globalStep}, waterLevel: ${waterLevelToUpdate}, before: ${swDrainLive[drainIdIndex].waterLevel[waterLevelToUpdate]}`)
                swDrainLive[drainIdIndex].waterLevel[waterLevelToUpdate] =
                    swDrainLive[drainIdIndex].waterLevel[waterLevelToUpdate] +
                    thisIncrementValue;
                // console.log(`After; ${swDrainLive[drainIdIndex].waterLevel[waterLevelToUpdate]}`)

                // the whole thing will be overwritten if the drain unblocks.
            }

            // make the QR code for this drain visible.
            const swDrainSymbolIconLayerID = drainID + 'Icon';
            map.setLayoutProperty(swDrainSymbolIconLayerID, 'visibility', 'visible');
            // until I've got the CORS issue resolved, I'm using a ring around the drain
            const swDrainSymbolLayerID = drainID + "symbol";
            map.setLayoutProperty(swDrainSymbolLayerID, "visibility", "visible");
        }
    }

    function clearDrain(drainID) {
        // Use drainID to get appropriate index
        const drainIdIndex = drainIdArray.indexOf(drainID);

        // Overwrite swDrainLive with original JSON data from swDrainSource.
        // This will reset status to 'clear', trigger to 'false' and blockageTimer to 0, as well as resetting all waterLevels.
        // This will also revert sybology back to baseline pulsing blue circles on CIRCLE layer.
        swDrainLive[drainIdIndex] = JSON.parse(
            JSON.stringify(swDrainSource[drainIdIndex])
        );

        // remove the alert symbol and white circles from SYMBOL layer
        const swDrainSymbolLayerID = drainID + "symbol";
        map.setLayoutProperty(swDrainSymbolLayerID, "visibility", "none");
        const swDrainSymbolIconLayerID = drainID + 'Icon';
        map.setLayoutProperty(swDrainSymbolIconLayerID, "visibility", "none");

        console.log(
            `Drain ${drainID} is CLEAR: ${swDrainLive[drainIdIndex].status}`
        );
    }

    function floodDrain(drainID) {
        // Get the index for this drainID from drainIDArray
        const drainIdIndex = drainIdArray.indexOf(drainID);

        // update swDrainLive source to 'flooded'
        swDrainLive[drainIdIndex].status = "flooded";
        console.log(
            `Drain ${drainID} is FLOODED: ${swDrainLive[drainIdIndex].status}`
        );

        // add splat animation on SYMBOL layer (remove QR code)
        const swDrainSymbolLayerID = drainID + "symbol";
        map.setPaintProperty(swDrainSymbolLayerID, "circle-color", "#9cdef0");

        // Update alert Icon to broken icon
        const swDrainSymbolIconLayerID = drainID + 'Icon';
        map.setLayoutProperty(swDrainSymbolIconLayerID, "icon-image", "brokenIcon");

        // Make the related CIRCLE layer for this drain invisible (the circle-radius will keep updating, but this doesn't matter)
        // map.setLayoutProperty(drainID, 'visibility', 'none');
        restoreBackgroundLayer(); //NOT WORKING
    }

    function endGame(gameAnimation) {
        console.log("Game over");
        clearInterval(gameAnimation);
        document.getElementById("legend").innerHTML = "GAME OVER! Thanks for playing";
        // reset symbols for drains that have not overflowed
        // PLAY SOME KIND OF ANIMATION TO INDICATE GAME OVER
    }

    ///////////////////////
    // PRESENTATION MODE //
    ///////////////////////

    // Presentation mode shows a list of layers in the upper right-hand box that can be switched on and off.

    // GLOBAL VARIABLES
    let isMenuVisible = false;
    let currentActiveLayer = "none";
    let previousActiveLayer = "none";
    let stringDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let stateId;

    // CREATE A FUNCTION TO RESET THE LEGEND BOX TO BLACK
    function removeLegend() {
        document.getElementById("legend").innerHTML = "";
        legendIndicator = "";
    }

    function activateMenu() {
        document.getElementById("presentationModeLayersBox").style.display =
            "block";
        isMenuVisible = true;
    }

    function deactivateMenu() {
        document.getElementById("presentationModeLayersBox").style.display = "none";
        isMenuVisible = false;
        //remove the event listener for numbers to activate layers
    }

    function toggleLayersFromNumber(keyInput) {
        if (keyInput <= statesList.length) {
            // check if keyboard input number corresponds to a map state (if list <9)
            // Check if that layer is currently active by checking the status of the checkbox.
            stateId = stateNamesList[keyInput - 1]; // retreive the name of the relevant map state from the states list
            console.log("stateId is:", stateId);
            toggleLayersFromStateId(stateId);
        }
        function toggleLayersFromStateId(stateId) {
            // match it to the stateIsActive dictionary to determine if the state is active
            if (document.getElementById(stateId).checked === false) {
                // Check the currentActiveLayer to see if there is a layer showing, turn it off. The previous layer will be 'none' if there's nothing showing.
                // this means only one checkbox at a time can be checked.
                // if (currentActiveLayer != "none") {
                //     clearLayerFromMap(previousActiveLayer);
                // };
                // if not active, activate the checkbox and map state.
                document.getElementById(stateId).checked = true;
                previousActiveLayer = currentActiveLayer;
                currentActiveLayer = stateId;
                statesList[keyInput - 1]();
                map.moveLayer("maskLayer");
                map.moveLayer("Show Town Hall");
                // dimBackgroundLayer();
            } else {
                clearLayerFromMap(stateId);
            }
        }
    }

    function clearLayerFromMap(stateId) {
        // lear the checkbox, all map layers and legend box
        document.getElementById(stateId).checked = false;
        previousActiveLayer = currentActiveLayer;
        currentActiveLayer = "none";

        for (layer in layersList) {
            map.removeLayer(layersList[layer]);
        }
        document.getElementById("legend").innerHTML = "";
        // removeLegend(layersList[subLayerCounter]);
        // runState(keyInput);
        restoreBackgroundLayer();
    }

    //  Functions to turn the background layer on and off.
    function dimBackgroundLayer() {
        // map.setPaintProperty('dimmableOverlayLayer', 'fill-opacity', 0.5);  //This one has a smoother fade in/out
        map.setLayoutProperty("dimmableOverlayLayer", "visibility", "visible"); //This one is a crisper on/off
    }

    function restoreBackgroundLayer() {
        // map.setPaintProperty('dimmableOverlayLayer', 'fill-opacity', 0);
        map.setLayoutProperty("dimmableOverlayLayer", "visibility", "none");
    }

    activateMenu(); // set the menu to visible for ASCA version

    // Set the map to listen for keyboard input, then save the keystrokes to activate the map layers
    window.addEventListener("keydown", (event) => {
        let keyInput = event.key; // save the keyboard input

        if (keyInput == "r" || keyInput == "R") {
            window.location.reload();
        }

        // Listen for keystroke 'm' to toggle menu on/off
        // if (keyInput == 'm' || keyInput == 'M') {
        //     // check if menu is already visible.
        //     if (document.getElementById('presentationModeLayersBox').style.display == 'none') { // the menu is not showing
        //         // turn the menu on
        //         activateMenu();
        //         // stopTramsStory();
        //     } else { // the menu is already showing
        //         // check if any layers are toggled on. If yes, we need turn them off first (noting there may be many).
        //         // NB: I can't get this to work

        //         // in all cases, deactivate the menu
        //         deactivateMenu();
        //     };
        // } else

        if (stringDigits.includes(keyInput)) {
            //check if keyboard input is a number
            console.log("valid digit:", keyInput);
            Number(keyInput); // convert to a number

            // if menu is not visible, do nothing
            if (isMenuVisible == false) {
                // do nothing
            } else {
                // if menu is visible, then toggle layers according to the keyboard input
                toggleLayersFromNumber(keyInput);
            }
        } else if (keyInput == "s") {
            stopTramsStory();
        } else {
            // do nothing
            console.log("invalid key input");
        }

        // listen for a new new key input. Differentiate between numbers and 'm'.
    });
});
