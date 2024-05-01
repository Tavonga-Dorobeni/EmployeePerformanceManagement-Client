<template>
  <div class="divide-y divide-slate-100 dark:divide-slate-700">
    <div
      v-for="(item, i) in users"
      :key="i"
      @click="openChat(item)"
      class="block w-full py-5 focus:ring-0 outline-none cursor-pointer group transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:bg-opacity-70"
    >
      <div class="flex space-x-3 px-6">
        <div class="flex-none">
          <div class="h-10 w-10 rounded-full relative">
            <span
              class="bg-success-500 status ring-1 ring-white inline-block h-[10px] w-[10px] rounded-full absolute -right-0 top-0"
            ></span>
            <img
              :src="avatar"
              alt=""
              class="block w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div class="flex-1 text-start flex">
          <div class="flex-1">
            <span
              class="block text-slate-800 dark:text-slate-300 text-sm font-medium mb-[2px]"
              >{{ item.firstname + " " + item.lastname }}</span
            >
            <span
              class="block text-slate-600 dark:text-slate-300 text-xs font-normal"
              >{{ item.email.slice(0, 14) + "..." }}</span
            >
          </div>
          <div class="flex-none text-right">
            <span
              v-if="messages.filter(m => m.SenderID == item.id && m.ReceiverID == currentUser.id && m.Status == 'Unread').length > 0"
              class="inline-flex flex-col items-center justify-center text-[10px] font-medium w-4 h-4 bg-[#FFC155] text-white rounded-full"
              >{{ messages.filter(m => m.SenderID == item.id && m.ReceiverID == currentUser.id && m.Status == 'Unread').length }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "vuex";

import { computed } from "vue";

const store = useStore();

const avatar = require("@/assets/images/users/avatar.png")

const contacts = computed(() => store.getters.getContacts);
const users = computed(() => store.getters.allUsers);
const messages = computed(() => store.getters.allMessages);
const currentUser = computed(() => store.state.auth.user);
const openChat = (data) => {
  store.dispatch("openChat", data);
};
</script>
<style></style>
