const center = { lat: 50.064192, lng: -130.605469 };
// Create a bounding box with sides ~10km away from the center point
const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
};
const input = document.getElementById("addressbox");
const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: "us" },
    fields: ["address_components", "geometry", "icon", "name"],
    origin: center,
    strictBounds: false,
    // types: ["postal_town"],
};
new google.maps.places.Autocomplete(input, options);


// function fillInAddress() {
//     // Get the place details from the autocomplete object.
//     const place = autocomplete.getPlace();
//
//     for (const component in componentForm) {
//         document.getElementById(component).value = "";
//         document.getElementById(component).disabled = false;
//     }
//
//     // Get each component of the address from the place details,
//     // and then fill-in the corresponding field on the form.
//     for (const component of place.address_components) {
//         const addressType = component.types[0];
//
//         if (componentForm[addressType]) {
//             const val = component[componentForm[addressType]];
//             document.getElementById(addressType).value = val;
//         }
//     }
// }
