<template>
  <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
    <Card bodyClass="p-6" v-for="(item, i) in tasks" :key="i">
      <!-- header -->
      <header class="flex justify-between items-end">
        <div class="flex space-x-4 items-center">
          <div class="flex-none">
            <div
              class="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize"
            >
              TK
            </div>
          </div>
          <div class="font-medium text-base leading-6">
            <div
              class="dark:text-slate-200 text-slate-900 max-w-[160px] truncate"
            >
              Task
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
      <div class="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-3">
        <b>{{ item.Description }} </b> <br/>
        <b>Assigned to: </b> {{ employees.filter(e => e.EmployeeID == item.EmployeeID).map(e => e.FullName)[0] }} <br/>
        <span
          v-if="item.Status == 'Pending'"
          class="inline-block text-center space-x-1 bg-secondary-500 bg-opacity-[0.16] min-w-[110px] text-secondary-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
        >
          {{ item.Status}}
        </span>
        <span
          v-if="item.Status == 'Assigned'"
          class="inline-block text-center space-x-1 bg-primary-500 bg-opacity-[0.16] min-w-[110px] text-primary-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
        >
          {{ item.Status}}
        </span>
        <span
          v-if="item.Status == 'Completed'"
          class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
        >
          {{ item.Status}}
        </span>
        <span
          v-if="item.Status == 'Overdue'"
          class="inline-block text-center space-x-1 bg-error-500 bg-opacity-[0.16] min-w-[110px] text-error-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
        >
          {{ item.Status}}
        </span>
      </div>
      <!--  date -->
      <div class="flex space-x-4">
        <!-- start date -->
        <div>
          <span class="block date-label">Start Date</span>
          <span class="block date-text">{{ item.StartDate?.substring(0, 10) }}</span>
        </div>
        <!-- end date -->
        <div>
          <span class="block date-label">End Date</span>
          <span class="block date-text">{{ item.EndDate?.substring(0, 10) }}</span>
        </div>
      </div>
    </Card>
    <Modal
      :title="assign ? 'Employee Shortlist' : 'Edit Task'"
      label=""
      labelClass="btn-small"
      ref="modal2"
      centered sizeClass="max-w-5xl"
    >
      <div v-if="!assign" class="md:space-x-4 items-center">
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <Textinput
            label="Description"
            type="text"
            v-model="currentTask.Description"
            placeholder="Enter Description"
            name="desc"
            :isReadonly="view"
          />
          <VueSelect v-if="!view" label="Site"
            ><vSelect :options="sites.map(s => s.Name)" v-model="currentTask.Site"
          /></VueSelect>
          <Textinput
            v-else
            label="Site"
            type="text"
            :modelValue="currentTask.Site"
            name="site"
            isReadonly="true"
          />
        </div>

        <VueSelect v-if="!view" label="Skills"
          ><vSelect :options="skills.map(s => s.Name)" v-model="currentTask.Skills" multiple
        /></VueSelect>
        <Textinput
          v-else
          label="Skills"
          type="text"
          :modelValue="currentTask.Skills"
          name="skills"
          isReadonly="true"
        />

        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <FromGroup v-if="!view" label="Start Date" name="d1">
            <flat-pickr
              v-model="currentTask.StartDate"
              class="form-control"
              id="d1"
              placeholder="yyyy, dd M"
            />
          </FromGroup>
          <Textinput
            v-else
            label="Start Date"
            type="text"
            :modelValue="currentTask.StartDate"
            name="s_date"
            isReadonly="true"
          />

          <FromGroup v-if="!view" label="End Date" name="d2">
            <flat-pickr
              v-model="currentTask.EndDate"
              class="form-control"
              id="d2"
              placeholder="yyyy, dd M"
            />
          </FromGroup>
          <Textinput
            v-else
            label="End Date"
            type="text"
            :modelValue="currentTask.EndDate"
            name="e_date"
            isReadonly="true"
          />
        </div>    
      </div>

      <div v-if="!view && assign" class="md:space-x-4 items-center">      
        <vue-good-table
          class="-mx-6"
          :columns="columns"
          styleClass=" vgt-table  table-head   v-middle striped lesspadding2 listview"
          :rows="employeePool"
          :pagination-options="{
            enabled: true,
            perPage: 10,
          }"
          :sort-options="{
            enabled: false,
          }"
        >
          <template v-slot:table-row="props">
            <span v-if="props.column.field == 'FullName'">
              <div class="flex space-x-3 items-center text-left">
                <div class="flex-none">
                  <div
                    class="h-10 w-10 rounded-full text-sm bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium -tracking-[1px]"
                  >
                    {{
                      props.row.FullName.charAt(0) +
                      props.row.FullName.charAt(props.row.FullName.length - 1)
                    }}
                  </div>
                </div>
                <div
                  class="flex-1 font-medium text-sm leading-4 whitespace-nowrap"
                >
                  {{
                    props.row.FullName.length > 20
                      ? props.row.FullName.substring(0, 20) + '...'
                      : props.row.FullName
                  }}
                </div>
              </div>
            </span>
            <span
              v-if="props.column.field == 'JobTitle'"
              class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
            >
              {{ props.row.JobTitle }}
            </span>
            <span
              v-if="props.column.field == 'matching_skills'"
              class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
            >
              <span
                v-for="(item, i) in skills.filter(s => props.row.skills.map(sk => sk.SkillID).includes(s.SkillID))" :key="i"
                class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
              >
                {{ item.Name}}
              </span>
            </span>
            <span
              v-if="props.column.field == 'load'"
              class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
            >
              {{ props.row.tasks.filter(t => new Date(t.StartDate.substring(0, 10)) <= new Date(currentTask.EndDate.substring(0, 10)) && new Date(t.EndDate.substring(0, 10)) >= new Date(currentTask.StartDate.substring(0, 10))).length }} Tasks
            </span>
            <div
              v-if="props.column.field == 'action'"
              class="action-btn text-end mr-3"
            >
              <Dropdown classMenuItems=" w-[140px]">
                <div class="text-xl">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </div>
                <template v-slot:menus>
                  <MenuItem v-for="(item, i) in assignAction" :key="i">
                    <div
                      @click="item.doit(props.row)"
                      :class="`
                  
                    ${
                      item.name === 'delete'
                        ? 'bg-danger-500 text-danger-500 bg-opacity-30  hover:bg-opacity-100 hover:text-white'
                        : 'hover:bg-slate-900 hover:text-white'
                    }
                    w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center `"
                    >
                      <span class="text-base"><Icon :icon="item.icon" /></span>
                      <span>{{ item.name }}</span>
                    </div>
                  </MenuItem>
                </template>
              </Dropdown>
            </div>
          </template>
          <template #pagination-bottom="props">
            <div class="py-4 px-3 justify-center flex">
              <Pagination
                :total="employeePool.length"
                :current="current"
                per-page="10"
                pageRange="10"
                @page-changed="current = $event"
                :pageChanged="props.pageChanged"
                :perPageChanged="props.perPageChanged"
              />
            </div>
          </template>
        </vue-good-table>
      </div>

      <template v-if="!view && !assign" v-slot:footer>
        <Button
          text="Submit"
          btnClass="btn-dark "
          @click="updateTask()"
        />
      </template>
      <template v-if="view || assign" v-slot:footer>
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
import FromGroup from "@/components/FromGroup";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { MenuItem } from '@headlessui/vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { assignOption } from '@/constant/data';
const store = useStore();
const router = useRouter();

const tasks = computed(() => store.getters.allTasks);
const sites = computed(() => store.getters.allSites);
const skills = computed(() => store.getters.allSkills);
const employees = computed(() => store.getters.allEmployees);
const employeePool = computed(() => store.getters.allEmployees.filter(e => e.skills.map(s => s.SkillID).some(el => currentTask.value.skills.map(s => s.SkillID).includes(el)) && e.SiteID == currentTask.value.SiteID))

let view = ref(false);
let assign = ref(false);
let current = ref(1);
let currentTask = ref({});
let columns = [
  {
    label: 'Fullname',
    field: 'FullName',
  },

  {
    label: 'Job Title',
    field: 'JobTitle',
  },

  {
    label: 'Matching Skills',
    field: 'matching_skills'
  },
  {
    label: 'Overlapping Tasks',
    field: 'load'
  },
  {
    label: 'Action',
    field: 'action',
  },
];
const modal2 = ref(null)

const totalDate = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffDays = endDate.getDate() - startDate.getDate();
  return diffDays;
};

const assignAction = ref([
  {
    name: 'assign',
    icon: 'heroicons:check',
    doit: (data) => {
      // data.Site = store.getters.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
      // data.Skills = store.getters.allSkills.filter(s => data.skills.map(sk => sk.SkillID).includes(s.SkillID)).map(s => s.Name)
      // view.value = true;
      // assign.value = false;
      currentTask.value.EmployeeID = data.EmployeeID;
      currentTask.value.Status = "Assigned";
      updateTask();
      modal2.value.closeModal();
    },
  },
]);

const actions = ref([
  {
    name: 'view',
    icon: 'heroicons:eye',
    doit: (data) => {
      data.Site = store.getters.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
      data.Skills = store.getters.allSkills.filter(s => data.skills.map(sk => sk.SkillID).includes(s.SkillID)).map(s => s.Name)
      view.value = true;
      assign.value = false;
      currentTask.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Edit',
    icon: 'heroicons-outline:pencil-alt',
    doit: (data) => {
      data.Site = store.getters.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
      data.Skills = store.getters.allSkills.filter(s => data.skills.map(sk => sk.SkillID).includes(s.SkillID)).map(s => s.Name)
      view.value = false;
      assign.value = false;
      currentTask.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Assign',
    icon: 'heroicons-outline:user',
    doit: (data) => {
      data.Site = store.getters.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
      data.Skills = store.getters.allSkills.filter(s => data.skills.map(sk => sk.SkillID).includes(s.SkillID)).map(s => s.Name)
      view.value = false;
      assign.value = true;
      currentTask.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Delete',
    icon: 'heroicons-outline:trash',
    doit: (data) => {
      const toast = useToast();
      store.dispatch('deleteTask', data)
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

const updateTask = () => {
  const toast = useToast();
  currentTask.value.SiteID = store.getters.allSites.filter(s => s.Name == currentTask.value.Site).map(s => s.SiteID)[0]
  currentTask.value.skills = store.getters.allSkills.filter(s => currentTask.value.Skills.includes(s.Name)).map(sk => sk.SkillID)

  store.dispatch('updateTask', currentTask.value)
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
