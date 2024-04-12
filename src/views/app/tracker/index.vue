<template>
    <div>
      <div class="flex flex-wrap justify-between items-center mb-4">
        <Breadcrumb />
  
        <div
          class="md:flex md:space-x-4 md:justify-end items-center"
          :class="width < 768 ? 'space-x-rb' : ''"
        >

        </div>

        <div class="h-[450px] w-full">
            <Map />
        </div>

      </div>
    </div>
  </template>
  
  <script setup>
  import Breadcrumb from "@/components/Breadcrumbs";
  import Map from "@/components/UserTrackerMap";
//   import Button from "@/components/Button";
//   import VueSelect from "@/components/Select/VueSelect";
//   import vSelect from "vue-select";
  
  
  </script>
  <style lang=""></style>
  