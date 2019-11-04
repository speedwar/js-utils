/**
 * Geolocation related helper functions
 */

export const findNearestArray = (basePos, targetPos) => {
  const lat = basePos.lat;
  const lng = basePos.lng;
  const R = 6371; // radius of earth in km
  const distances = [];
  let closest = -1;

  for (let i = 0; i < targetPos.length; i++) {
    if (targetPos) {
      const mlat = targetPos[i].Latitude;
      const mlng = targetPos[i].Longitude;
      const dLat = rad(mlat - lat);
      const dLong = rad(mlng - lng);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      distances[i] = d;

      if (closest === -1 || d < distances[closest]) {
        closest = i;
      }
    }
  }

  function rad(x) {
    return x * Math.PI / 180
  }

  return closest
}

/**
 * Return location data within the radius and maxitems, sorted by closest distance
 *
 * @param { Array of Objects } data - The results from getLocations
 * @param { google LatLng Object } origin - Coordinates to start from
 * @param { Integer | null } radius - Only return results within the distance. If null, search until you get the maxitems.
 * @param { Integer | null } limit - Number of results to return. If null, return all within Map bounds.
 * @return { Array of Objects } - Filtered sorted data
 */
export const getNearest = (data, origin, radius, limit) => {
  // default
  let returns = [],
    nearishIndexes = [],
    nearish = []

  // Get all Locations within radius area
  data.map((record, j) => {
    let toLatLng = formatLatlng(record.Latitude, record.Longitude),
      calcDistanceBetween

    if (!nearishIndexes[j]) { // Not already in results
      calcDistanceBetween = calculateByLatlng(origin, toLatLng, radius)
      nearish.push({
        sortValue: calcDistanceBetween,
        content: record
      });
      nearishIndexes[j] = true
    }
  })

  nearish.sort(compareSortValue)
  nearish.map((record_b) => {
    returns.push(record_b.content)
  })

  let maxSites = returns;
  if (limit) { maxSites = returns.slice(0, limit) }

  return maxSites
}

export const formatLatlng = (latitude, longitude) => {
  let lat = latitude, lng = longitude
  if (typeof latitude || longitude !== 'number') {
    lat = parseFloat(latitude)
    lng = parseFloat(longitude)
  }
  const latlngObj = { lat: lat, lng: lng }
  return latlngObj
}

export const calculateByLatlng = (origin, destination, radius) => {
  const originLatLng = new window.google.maps.LatLng(origin)
  const destinationLatLng = new window.google.maps.LatLng(destination)
  const distanceBetween =
    window.google.maps.geometry.spherical.computeDistanceBetween(originLatLng, destinationLatLng, radius)
  return distanceBetween
}

export const geocodeLatLng = (latlng, geocoder, map) => {
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        let marker = new window.google.maps.Marker({
          position: latlng,
          map: map
        })

        console.log(results[0].formatted_address)
        return results[0].formatted_address

      } else {
        console.log('No results found')
      }
    } else {
      console.error('Geocoder failed due to:', status)
    }
  })
}
