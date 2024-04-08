<template>
  <div class="h-[350px] w-full">
    <l-map
      ref="map"
      @dblclick="onMapClick"
      :zoom="zoom"
      :center="[
        defaultLocation.lat,
        defaultLocation.lng
      ]"
    >
      <l-tile-layer 
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
      />
      <l-marker
        visible
        draggable
        :icon="icon"
        :lat-lng.sync="position"
        @dragstart="dragging = true"
        @dragend="dragging = false"
      >
        <l-tooltip :content="tooltipContent" :options="{ permanent: true }" />
      </l-marker>
    </l-map>
  </div>
</template>

<script>
// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { icon } from "leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    defaultLocation: {
      type: Object,
      default: () => ({
        lat: -17.795235,
        lng: 31.032725
      })
    }
  },
  data() {
    return {
      loading:false,
      userLocation: {},
      location: {
        lat: -17.795235,
        lng: 31.032725
      },
      icon: icon({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png")
      }),
      position: {
        lat: -17.795235,
        lng: 31.032725
      },
      address:"",
      tileProvider: {
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      },
      zoom: 18,
      dragging:false
    };
  },
  mounted() {
    this.getUserPosition();
  },
  watch: {
    position: {
      deep: true,
      async handler(value) {
        this.address = await this.getAddress();
        this.$emit("input", { position: value, address: this.address });
      }
    }
  },
  computed: {
    tooltipContent() {
      if (this.dragging) return "...";
      if (this.loading) return "Loading...";
      return `<strong>lat:</strong> ${
        this.location.lat
      }<br/> <strong>lng:</strong> ${this.location.lng}`;
    }
  },
  methods: {
    async getAddress() {
      this.loading = true;
      let address = "Unresolved address";
      try {
        const { lat, lng } = this.position;
        const result = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        if (result.status === 200) {
          const body = await result.json();
          address = body.display_name;
        }
      } catch (e) {
        console.error("Reverse Geocode Error->", e);
      }
      this.loading = false;
      return address;
    },
    onMapClick(event) {
      // place the marker on the clicked spot
      this.position = event.latlng;
      console.log(this.position)
    },
    getUserPosition() {
      if (navigator.geolocation) {
        // get GPS position
        navigator.geolocation.getCurrentPosition(pos => {
          // set the user location
          const latlong = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          this.location = JSON.parse(JSON.stringify(latlong))
        });
      }
    }
  }
};
</script>
<style lang="scss">
.leaflet-control {
  z-index: 0 !important;
}
.leaflet-control-container {
  z-index: 555 !important;
  position: relative;
}
</style>
