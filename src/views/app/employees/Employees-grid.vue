<template>
  <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
    <Card bodyClass="p-6" v-for="(item, i) in employees" :key="i">
      <!-- header -->
      <header class="flex justify-between items-end">
        <div class="flex space-x-4 items-center">
          <div class="flex-none">
            <div
              class="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize"
            >
              {{ item.FullName.charAt(0) + item.FullName.charAt(1) }}
            </div>
          </div>
          <div class="font-medium text-base leading-6">
            <div
              class="dark:text-slate-200 text-slate-900 max-w-[160px] truncate"
            >
              {{ item.FullName }}
            </div>
          </div>
        </div>
        <div>
          <Dropdown classMenuItems=" w-[130px]">
            <span
              class="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400"
              ><Icon icon="heroicons-outline:dots-vertical"
            /></span>
            <template v-slot:menus>
              <MenuItem v-for="(mneu, i) in actions" :key="i">
                <div
                  @click="mneu.doit(item)"
                  :class="`
                
                  ${'hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white'}
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center  capitalize `"
                >
                  <span class="text-base"><Icon :icon="mneu.icon" /></span>
                  <span>{{ mneu.name }}</span>
                </div>
              </MenuItem>
            </template>
          </Dropdown>
        </div>
      </header>
      <!-- description -->
      <div class="text-slate-600 dark:text-slate-400 text-sm pt-4">
        <b>{{ item.JobTitle }}</b>
      </div>
      <div class="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-3">
        <b>Employee ID: </b> {{ item.EmployeeID }} <br/>
        <b>Site: </b> {{ sites.filter(s => s.SiteID == item.SiteID).map(s => s.Name)[0] }} <br/>
      </div>
      <!--  date -->
      <div class="flex space-x-4">
        <!-- start date -->
        <div>
          <span class="block date-label">Mobile</span>
          <span class="block date-text">{{ item.Phone }}</span>
        </div>
        <!-- end date -->
        <div>
          <span class="block date-label">Email</span>
          <span class="block date-text">{{ item.Email }}</span>
        </div>
      </div>
      <div class="text-slate-400 dark:text-slate-400 text-sm font-normal mt-2">
        Skills:
      </div>
      <div class="grid grid-cols-3 gap-1 mt-1">

        <div v-for="(skill, s) in item.skills" :key="s" class="text-right">
          <span
            class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[90px] text-success-500 text-xs font-normal pr-1 py-1 rounded-full"
          >
            {{ skills.filter(s => s.SkillID == skill.SkillID).map(s => s.Name)[0]}}
          </span>
        </div>
      </div>
    </Card>
    <Modal
      title="Edit Employee"
      label=""
      labelClass="btn-small"
      ref="modal2"
      centered sizeClass="max-w-5xl"
    >
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <!-- <Textinput
          label="Employee Number"
          type="text"
          v-model="currentEmployee.EmployeeID"
          placeholder="------"
          name="employee_number"
          isReadonly="true"
        /> -->
        <VueSelect v-if="!view" label="Site"
          ><vSelect :options="sites.map(s => s.Name)" v-model="currentEmployee.Site"
        /></VueSelect>
        <Textinput
          v-else
          label="Site"
          type="text"
          :modelValue="sites.filter(s => s.SiteID == currentEmployee.SiteID).map(s => s.Name)[0]"
          name="site"
          isReadonly="true"
        />
        <VueSelect v-if="!view" label="Skills"
          ><vSelect :options="skills.map(s => s.Name)" v-model="currentEmployee.Skills" multiple
        /></VueSelect>
        <Textinput
          v-else
          label="Skills"
          type="text"
          v-model="currentEmployee.Skills"
          name="skills"
          isReadonly="true"
        />
        <Textinput
          label="Fullname"
          type="text"
          v-model="currentEmployee.FullName"
          placeholder="Enter FullName"
          name="fullName"
          :isReadonly="view"
        />
        <Textinput
          label="JobTitle"
          type="text"
          v-model="currentEmployee.JobTitle"
          placeholder="Enter Job Title"
          name="jobtitle"
          :isReadonly="view"
        />
        <Textinput
          label="Email"
          type="text"
          v-model="currentEmployee.Email"
          placeholder="Enter Email"
          name="email"
          :isReadonly="view"
        />
        <Textinput
          label="Mobile"
          type="text"
          v-model="currentEmployee.Phone"
          placeholder="Enter Phone"
          name="phone"
          :isReadonly="view"
        />
        <Textinput
          label="Latitude"
          type="text"
          v-model="currentEmployee.Latitude"
          placeholder="Enter Latitude"
          name="latitude"
          isReadonly
        />
        <Textinput
          label="Longitude"
          type="text"
          v-model="currentEmployee.Longitude"
          placeholder="Enter Longitude"
          name="longitude"
          isReadonly
        />
      </div>

      <template v-if="!view" v-slot:footer>
        <Button
          text="Submit"
          btnClass="btn-dark "
          @click="updateEmployee()"
        />
      </template>
      <template v-else v-slot:footer>
        <Button
          text="Close"
          btnClass="btn-dark "
          @click="$refs.modal2.closeModal()"
        />
      </template>
    </Modal>
  </div>
</template>
<script setup>
import Card from '@/components/Card';
import Dropdown from '@/components/Dropdown';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal/Modal';
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { MenuItem } from '@headlessui/vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();

const employees = computed(() => store.getters.allEmployees);
const skills = computed(() => store.getters.allSkills);
const sites = computed(() => store.getters.allSites);

let view = ref(false);
let currentEmployee = ref({});
const modal2 = ref(null)

const totalDate = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffDays = endDate.getDate() - startDate.getDate();
  return diffDays;
};

const actions = ref([
  {
    name: 'view',
    icon: 'heroicons:eye',
    doit: (data) => {
      data.Site = store.getters.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
      data.Skills = data.skills.map(s => store.getters.allSkills.filter(sk => sk.SkillID == s.SkillID).map(sk => sk.Name)[0])
      console.log(data)
      view.value = true;
      currentEmployee.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Edit',
    icon: 'heroicons-outline:pencil-alt',
    doit: (data) => {
      data.Site = store.getters.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
      data.Skills = data.skills.map(s => store.getters.allSkills.filter(sk => sk.SkillID == s.SkillID).map(sk => sk.Name)[0]),
      console.log(data)
      view.value = false;
      currentEmployee.value = data;
      modal2.value.openModal();
    },
  },
  // {
  //   name: 'Calibrate',
  //   icon: 'heroicons-outline:wrench',
  //   doit: (data) => {
  //     store.commit('setActiveData', data);
  //     router.push({ name: 'calibration' });
  //   },
  // },
  {
    name: 'Delete',
    icon: 'heroicons-outline:trash',
    doit: (data) => {
      const toast = useToast();
      store.dispatch('deleteEmployee', data)
      .then(response => {
        toast.success(response.data.message, {
          timeout: 2000,
        });    
      },
      error => {
        toast.error((error.response && error.response.data) ||
            error.message ||
            error.toString(), {
          timeout: 2000,
        });   
      })
    },
  },
]);

const updateEmployee = () => {
  const toast = useToast();
  currentEmployee.value.SiteID = store.getters.allSites.filter(s => s.Name == currentEmployee.value.Site).map(s => s.SiteID)[0]
  currentEmployee.value.skills = currentEmployee.value.Skills.map(s => store.getters.allSites.filter(sk => sk.Name == s.Name).map(sk => ({SkillID: sk.SkillID})))
  console.log(currentEmployee.value)
  store.dispatch('updateEmployee', currentEmployee.value)
  .then(response => {
    modal2.value.closeModal();
    toast.success(response.data.message, {
      timeout: 2000,
    });    
  },
  error => {
    modal2.value.closeModal();
    toast.error((error.response && error.response.data) ||
        error.data.message ||
        error.toString(), {
      timeout: 2000,
    });   
  })
}
</script>
<style lang="scss" scoped>
.date-label {
  @apply text-xs text-slate-400 dark:text-slate-400 mb-1;
}
.date-text {
  @apply text-xs text-slate-600 dark:text-slate-300 font-medium;
}
</style>
