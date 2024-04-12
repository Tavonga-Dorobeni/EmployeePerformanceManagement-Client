<template>
  <router-view />
</template>

<script>
import { mapGetters } from 'vuex';
import * as Ably from "ably";

var ably = new Ably.Realtime({
  key: "tBnWQA.2fp5mg:6qVhXVi2HJ9Dx5fw5N2szmQe-cRG1O905x0paJzWohc",
  clientId: `${Math.random() * 1000000}`
});

export default {
  name: 'app',

  data() {
    return {
      usersName: null,
      gettingLocation: true,
      initialPosition: {
        lat: 10,
        lng: 10
      },
      zoom: 11,
      markers: [],
      userlocation: [],
      onlineUsers: [],
      channelName: "EPMS"
    };
  },

  sockets: {
    connect() {
      console.log('socket connected')
    },
    socketres(res) {
      this.$store.commit(`${res.commit}`, res.data)
    },
    locationres(res) {
      this.$store.dispatch('updateEmployee', res)
      this.$emitter.emit('addMarker', res)
    },
    claim_flagged_res(res) {
      this.$emitter.emit('claim_flagged', {})
      this.$store.commit(`${res.commit}`, res.data)
    },
    claim_verified_res(res) {
      this.$emitter.emit('claim_verified', {})
      this.$store.commit(`${res.commit}`, res.data)
    },
  },

  mounted() {
    // const name = prompt('To get started, input your name in the field below and locate your friends around based on your location, please turn on your location setting \n What is your name?')
    this.usersName = this.currentUser.firstname + " " + this.currentUser.lastname
    console.log("Username: " + this.usersName)
    // const channel = prompt('Enter the name of the channel you are interested in')
    // this.channelName = channel
  },

  computed: {
    ...mapGetters([
      "allEmployees",
    ]),

    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  async created() {
    await this.fetchData();
    var channel = ably.channels.get(this.channelName);
    channel.attach(err => {
      if (err) {
        return console.error("Error attaching to the channel");
      }
      console.log("We are now attached to the channel");
      channel.presence.enter(this.userlocation, function(err) {
        if (err) {
          return console.error("Error entering presence");
        }
        console.log("We are now successfully present");
      });
    });

    let self = this;
    channel.presence.subscribe("update", function(presenceMsg) {
      console.log(presenceMsg)
      console.log(
        "Received a " + presenceMsg.action + " from " + presenceMsg.clientId
      );
      channel.presence.get(function(err, members) {
        console.log(members)
        
        // self.markers = members.map(mem => {
        //   if (JSON.stringify(self.userlocation) == JSON.stringify(mem.data)) {
        //     return {
        //       ...mem.data,
        //       icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        //     };
        //   } else {
        //     return {
        //       ...mem.data,
        //       icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        //     };
        //   }
        // });
        // self.onlineUsers = members;
        console.log(
          "There are now " + members.length + " clients present on this channel"
        );
      });
    });
  },

  methods: {
    fetchData() {
      if (!("geolocation" in navigator)) {
        this.errorStr = "Geolocation is not available.";
        return;
      }
      this.gettingLocation = true;
      navigator.geolocation.watchPosition(
        pos => {
          let Employee = this.allEmployees.filter(e => e.FullName.includes(this.currentUser.firstname) && e.FullName.includes(this.currentUser.lastname))
          this.$store.dispatch('updateEmployee', {EmployeeID: Employee?.EmployeeID, FullName: Employee?.FullName, Latitude: pos.coords.latitude, Latitude: pos.coords.longitude})
          this.$socket.client.emit('setlocation', {EmployeeID: Employee?.EmployeeID, FullName: Employee?.FullName, Latitude: pos.coords.latitude, Latitude: pos.coords.longitude});
          this.gettingLocation = false;
          this.initialPosition.lat = pos.coords.latitude;
          this.initialPosition.lng = pos.coords.longitude;
          const userData = {
            position: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            },
            userName: this.usersName
          };
          this.userlocation = userData;
          this.updateRoom(userData);
        },
        err => {
          this.gettingLocation = false;
          this.errorStr = err.message;
        }
      );
    },

    updateRoom(data) {
      var channel = ably.channels.get(this.channelName);
      channel.presence.update(data, function(err) {
        if (err) {
          return console.error("Error updating presence data");
        }
        console.log("We have successfully updated our data");
      });
    }
  }
}
</script>

<style></style>
