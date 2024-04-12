<template>
  <l-map
    ref="map"
    :zoom="zoom"
    maxZoom="18"
    :center="[
      position?.lat || userLocation.lat || defaultLocation.lat,
      position?.lng || userLocation.lng || defaultLocation.lng
    ]"
  >
    <l-tile-layer
      :url="tileProvider.url"
      :attribution="tileProvider.attribution"
    />
    <l-marker
      v-for="(item, i) in markers" :key="i"
      visible
      :draggable="draggable"
      :icon="icon"
      :lat-lng.sync="{lat: item.Latitude, lng: item.Longitude}"
    >
      <l-tooltip :content="item.FullName" :options="{ permanent: true }" />
    </l-marker>
    <l-circle
      v-for="(item, i) in allSites" :key="i"
      :lat-lng="{lat: item.Latitude, lng: item.Longitude}"
      :radius="250"
    />
  </l-map>
</template>
<script>
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LMarker,
  LTileLayer,
  LTooltip,
  LCircle
} from "@vue-leaflet/vue-leaflet";
import { icon } from "leaflet";
import {parse, stringify} from 'flatted';
import { mapGetters } from 'vuex';
import * as Ably from "ably";

var ably = new Ably.Realtime({
  key: "tBnWQA.2fp5mg:6qVhXVi2HJ9Dx5fw5N2szmQe-cRG1O905x0paJzWohc",
  clientId: `${Math.random() * 1000000}`
});

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LCircle
  },
  props: {
     value: {
      type: Object,
      required: true
    },
    defaultLocation: {
      type: Object,
      default: () => ({
        lat: -17.838604385652317,
        lng: 31.007140874862674
      })
    }
  },
  data() {
    return {
      log: null,
      loading:false,
      draggable: false,
      markers: null,
      userlocation: [],
      userLocation: {},
      icon: icon({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png")
      }),
      position: {},
      address:"",
      tileProvider: {
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      },
      zoom: 16,
      dragging:false
    };
  },

  mounted() {
    this.getUserPosition();
    this.$emitter.on('addMarker', (data) => {
      this.markers.unshift(data)
    })
    // this.$emitter.on('disableDrag', () => {
    //   this.draggable = false
    // })
  },

  watch: {
    position: {
      deep: true,
      async handler(value) {
        this.address = await this.getAddress();
        // this.$emit("input", { position: value, address: this.address });
      }
    }
  },

  computed: {
    ...mapGetters([
      "allEmployees",
      "allSites"
    ]),

    tooltipContent() {
      if (this.dragging) return "...";
      if (this.loading) return "Loading...";
      return `<strong>${this.address.replace(
        ",",
        "<br/>"
      )}</strong> <hr/><strong>lat:</strong> ${
        this.position?.lat
      }<br/> <strong>lng:</strong> ${this.position?.lng}`;
    }
  },

  async created(){
    this.markers = [...this.allEmployees]
    var channel = ably.channels.get("EPMS");
    let self = this;
    channel.presence.subscribe("update", function(presenceMsg) {
      console.log(presenceMsg)
      console.log(
        "Received a " + presenceMsg.action + " from " + presenceMsg.clientId
      );
      channel.presence.get(function(err, members) {
        console.log(members)
        
        self.markers = members.map(mem => {
          if (JSON.stringify(self.userlocation) == JSON.stringify(mem.data)) {
            return {
              ...mem.data,
              icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            };
          } else {
            return {
              ...mem.data,
              icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            };
          }
        });
        // self.onlineUsers = members;
        console.log(
          "There are now " + members.length + " clients present on this channel"
        );
      });
    });
  },
  
  methods: {
    async getAddress() {
      this.loading = true;
      let address = "Unresolved address";
      try {
        if(this.position){
          const { lat, lng } = this.position;
          const result = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          if (result.status === 200) {
            const body = await result.json();
            address = body.display_name;
          }
        }
      } catch (e) {
        console.error("Reverse Geocode Error->", e);
      }
      this.loading = false;
      return address;
    },

    getUserPosition() {
      if (navigator.geolocation) {
        // get GPS position
        navigator.geolocation.getCurrentPosition(pos => {
          // set the user location
          this.userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
        });
      }
    }
  }
};
</script>