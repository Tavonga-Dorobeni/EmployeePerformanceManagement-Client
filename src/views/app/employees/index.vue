<template>
  <div>
    <div class="flex flex-wrap justify-between items-center mb-4">
      <Breadcrumb />

      <div
        class="md:flex md:space-x-4 md:justify-end items-center"
        :class="width < 768 ? 'space-x-rb' : ''"
      >
        <Button
          icon="heroicons:list-bullet"
          text="List view"
          :btnClass="`${
            fillter === 'list'
              ? 'bg-slate-900 dark:bg-slate-700  text-white'
              : ' bg-white dark:bg-slate-800 dark:text-slate-300'
          }   h-min text-sm font-normal`"
          iconClass=" text-lg"
          @click="fillter = 'list'"
          :isLoading="isSkeletion2"
          :isDisabled="isSkeletion"
        />
        <Button
          icon="heroicons-outline:view-grid"
          text="Grid view"
          :btnClass="`${
            fillter === 'grid'
              ? 'bg-slate-900 dark:bg-slate-700 text-white'
              : ' bg-white dark:bg-slate-800 dark:text-slate-300'
          }   h-min text-sm font-normal`"
          iconClass=" text-lg"
          @click="fillter = 'grid'"
          :isLoading="isSkeletion"
          :isDisabled="isSkeletion2"
        />
        <Modal
          title="New Employee"
          label="➕ Add Employee"
          labelClass="btn-dark dark:bg-green-800  h-min text-sm font-normal"
          ref="modal2"
          centered sizeClass="max-w-5xl"
        >
          <form class="space-y-4">
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <!-- <Textinput
                label="Employee Number"
                type="text"
                v-model="employee.EmployeeID"
                placeholder="------"
                name="employee_number"
                isReadonly="true"
              /> -->

              <Textinput
                label="Fullname"
                type="text"
                v-model="employee.FullName"
                placeholder="Enter FullName"
                name="fullName"
              />
              <Textinput
                label="JobTitle"
                type="text"
                v-model="employee.JobTitle"
                placeholder="Enter Job Title"
                name="jobtitle"
              />
              <Textinput
                label="Email"
                type="text"
                v-model="employee.Email"
                placeholder="Enter Email"
                name="email"
              />
              <Textinput
                label="Mobile"
                type="text"
                v-model="employee.Phone"
                placeholder="Enter Phone"
                name="phone"
              />
              <VueSelect label="Site"
                ><vSelect :options="sites.map(s => s.Name)" v-model="employee.Site"
              /></VueSelect>
              <VueSelect label="Skills"
                ><vSelect :options="skills.map(s => s.Name)" v-model="employee.Skills" multiple
              /></VueSelect>
              <Textinput
                label="Latitude"
                type="text"
                v-model="employee.Latitude"
                placeholder="Enter Latitude"
                name="latitude"
              />
              <Textinput
                label="Longitude"
                type="text"
                v-model="employee.Longitude"
                placeholder="Enter Longitude"
                name="longitude"
              />
            </div>
          </form>
          <template v-slot:footer>
            <Button
              text="Submit"
              btnClass="btn-dark "
              @click="handleNew(employee); $refs.modal2.closeModal()"
            />
          </template>
        </Modal>
      </div>
    </div>
    <GridSkletion :count="employees.length" v-if="isSkeletion" />
    <TableSkeltion :count="employees.length" v-if="isSkeletion2" />
    <Grid v-if="fillter === 'grid' && !isSkeletion" />
    <List v-if="fillter === 'list' && !isSkeletion2" />

    <EmployeeAddmodal />
    <updateModal />
  </div>
</template>

<script setup>
import Breadcrumb from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import GridSkletion from "@/components/Skeleton/Project-grid";
import TableSkeltion from "@/components/Skeleton/Table";
import Modal from '@/components/Modal/Modal';
import Textinput from "@/components/Textinput";
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { computed, ref, watch, onMounted, defineEmits } from "vue";
import EmployeeAddmodal from "./AddEmployee";
import updateModal from "./EditEmployee";
import List from "./Employees-list";
import Grid from "./Employees-grid";
import { useStore } from "vuex";
import { useEmitter } from "@/mitt";

const {emitter} = useEmitter();
const store = useStore();

let fillter = ref("grid");
const openEmployee = () => {
  store.dispatch("openEmployee");
};

let employee = {};

const width = ref(0);
const handleResize = () => {
  width.value = window.innerWidth;
};

const handleEmit = () => {
  fillter.value = "list";
  setTimeout(() => {
    emitter.emit('search')
  }, 500);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();

  emitter.on('notification', () => {
    handleEmit();
  })
});

const employees = computed(() => store.getters.allEmployees);
const sites = computed(() => store.getters.allSites);
const skills = computed(() => store.getters.allSkills);

const isSkeletion = ref(true);
const isSkeletion2 = ref(null);
setTimeout(() => {
  isSkeletion.value = false;
  isSkeletion2.value = false;
}, 1000);

const toast = useToast();
const handleNew = (new_employee) => {
  new_employee.SiteID = store.getters.allSites.filter(s => s.Name == new_employee.Site).map(s => s.SiteID)[0]
  new_employee.skills = new_employee.Skills.map(s => store.getters.allSites.filter(sk => sk.Name == s.Name).map(sk => ({SkillID: sk.SkillID})))

  const data = {
    employee: new_employee,
    skills: new_employee.skills
  }

  store.dispatch("createEmployee", data)
  .then(data =>{
    // use vue-toast-notification app use
    toast.success(data.data.message, {
        timeout: 2000,
      });          
  },
  error => {
    toast.error((error.response && error.response.data) ||
          error.data.message ||
          error.toString(), {
        timeout: 2000,
      });   
  })
}

// watch fillter with switch case
watch(fillter, () => {
  switch (fillter.value) {
    case "grid":
      fillter.value = "grid";
      isSkeletion.value = true;
      setTimeout(() => {
        isSkeletion.value = false;
      }, 1000);

      break;
    case "list":
      fillter.value = "list";
      isSkeletion2.value = true;
      setTimeout(() => {
        isSkeletion2.value = false;
      }, 1000);
      break;
    default:
      fillter.value = "grid";
      break;
  }
});
</script>
<style lang=""></style>
