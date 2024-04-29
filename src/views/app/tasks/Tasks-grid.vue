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
      :title="assign ? 'Employee Shortlist' : report ? 'Task Progress Report' : 'Edit Task'"
      label=""
      labelClass="btn-small"
      ref="modal2"
      centered sizeClass="max-w-5xl"
    >
      <div v-if="!assign && !report" class="md:space-x-4 items-center">
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

      <div v-if="!view && assign && !report" class="md:space-x-4 items-center">      
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
              <!-- {{ new Date(currentTask.EndDate.substring(0, 10)).getTime() >= new Date(props.row.tasks[1].StartDate.substring(0, 10)).getTime() }} -->
              {{ props.row.tasks.map(t => tasks.filter(ts => ts.TaskID == t.TaskID)[0]).filter(t => new Date(currentTask.StartDate?.substring(0, 10)).getTime() <= new Date(t.EndDate?.substring(0, 10)).getTime() && new Date(currentTask.EndDate?.substring(0, 10)).getTime() >= new Date(t.StartDate?.substring(0, 10)).getTime()).length }} Tasks
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

      <div v-if="!view && !assign && report" class="md:space-x-4 items-center">   
           
        <vue-good-table
          class="-mx-6"
          :columns="reportColumns"
          styleClass=" vgt-table  table-head   v-middle striped lesspadding2 listview"
          :rows="taskActvities.filter(a => a.TaskID == currentTask.TaskID)"
          :pagination-options="{
            enabled: true,
            perPage: 10,
          }"
          :sort-options="{
            enabled: false,
          }"
        >
          <template v-slot:table-row="props">
            <span
              v-if="props.column.field == 'Activity'"
              class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
            >
              {{ props.row.Activity }}
            </span>
            <span
              v-if="props.column.field == 'Date'"
              class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
            >
              {{ props.row.Date.substring(0, 10) }}
            </span>
            <span
              v-if="props.column.field == 'createdAt'"
              class="text-slate-500 dark:text-slate-400 block min-w-[108px]"
            >
              {{ props.row.createdAt.substring(0, 10) }}
            </span>
          </template>
          <template #pagination-bottom="props">
            <div class="py-4 px-3 justify-center flex">
              <Pagination
                :total="taskActvities.filter(a => a.TaskID == currentTask.TaskID).length"
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

      <template v-if="!view && !assign && !report" v-slot:footer>
        <Button
          text="Submit"
          btnClass="btn-dark "
          @click="updateTask()"
        />
      </template>
      <template v-if="view || assign || report" v-slot:footer>
        <Button
          v-if="report"
          text="Print"
          btnClass="btn-dark "
          @click="generatePDF(taskActvities.filter(a => a.TaskID == currentTask.TaskID))"
        />
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
import {parse, stringify} from 'flatted';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
const store = useStore();
const router = useRouter();

const tasks = computed(() => store.getters.allTasks);
const taskActvities = computed(() => store.getters.allTaskActivities);
const sites = computed(() => store.getters.allSites);
const skills = computed(() => store.getters.allSkills);
const employees = computed(() => store.getters.allEmployees);
const employeePool = computed(() => store.getters.allEmployees.filter(e => e.skills.map(s => s.SkillID).some(el => currentTask.value.skills.map(s => s.SkillID).includes(el)) && e.SiteID == currentTask.value.SiteID))

let view = ref(false);
let assign = ref(false);
let report = ref(false);
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

let reportColumns = [
  {
    label: 'Activity Done',
    field: 'Activity',
  },

  {
    label: 'Date',
    field: 'Date',
  },

  {
    label: 'Date Captured',
    field: 'createdAt'
  },

  {
    label: '',
    field: 'action'
  }
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
      let currentEmployee = store.getters.allEmployees.filter(e => e.EmployeeID == data.EmployeeID)[0]
      currentEmployee.new_task = {TaskID: currentTask.value.TaskID}
      currentTask.value.EmployeeID = data.EmployeeID;
      currentTask.value.Status = "Assigned";
      updateTask()
      console.log(currentEmployee)
      store.dispatch('updateEmployee', currentEmployee)
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
      report.value = false;
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
      report.value = false;
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
      report.value = false;
      currentTask.value = data;
      modal2.value.openModal();
    },
  },
  {
    name: 'Report',
    icon: 'heroicons-outline:document-duplicate',
    doit: (data) => {
      data.Site = store.getters.allSites.filter(s => s.SiteID == data.SiteID).map(s => s.Name)[0]
      data.Skills = store.getters.allSkills.filter(s => data.skills.map(sk => sk.SkillID).includes(s.SkillID)).map(s => s.Name)
      view.value = false;
      assign.value = false;
      report.value = true;
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

// const getImgFromUrl = (Payload, callback) => {
//   var img = new Image();
//   const imgData = "data:image/png;base64,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"
//   img.onload = function () {
//       callback(Payload, img);
//   };
// } 

const generatePDF = async (Payload) => {
  const obj = parse(stringify(Payload))
  const task = await store.getters.allTasks.filter(t => t.TaskID == obj.TaskID)
  const employee = store.getters.allEmployees.filter(e => e.EmployeeID == task[0]?.EmployeeID)
  const columns = [
    { title: 'Activity Done', dataKey: 'Activity' },
    { title: 'Date', dataKey: 'Date', },
    { title: 'Date Captured', dataKey: 'createdAt'},
  ];

  const addFooters = doc => {
    const pageCount = doc.internal.getNumberOfPages()

    for (var i = 1; i <= pageCount; i++) {
      const imgData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAAsCAYAAABIUrd3AAAAAXNSR0IArs4c6QAAEmBJREFUeF7tWglUk1myJiGAQEDQdkEF2RyFHHFBCIioxITHqogLQiMCPrDtB3RYVFahlU1NFBsbxqVZNC3ajAiyKsgiPJSIrdgqKCgiyxMbCS0IsoTMqYzX9xt/DD3TDk7DPYfDn7vWra+qblXdS5CYKOOOA4Rxt+OJDUtMgD4OhWAC9AnQxyEHxuGW/22a/uLFC3JnZydBSkqKOHXqVGJvb69kf38/SUND4/k45PuYbvmTg87hcDYmJyfvrampWSglJSUhIyMjMTQ0JDEwMCAxefLkQTMzswuBgYGBmpqaTWPKiXG0+CcF/cmTJzMYDMbdx48fTycSiRKSkpISg4ODEgQCQUIgELz77+XlFX/s2DGfccT3Md3qJwW9pKRkhZWVVTloNoCNCgIdfsP3ypUruaWlpcYEAmF4TLkxThb/pKBfunRphb29fTmfzxdqNiqg9fAb1ZmZmf0vCMg44fmYb/OTgl5eXr7C1NS0HLtL0GwoCHA456lUakVFRYXpmHNjnBDwh4BeXV0tVVZW9t+FhYWbPD09Y+zt7QuBf4WFhSsYDMZ7oOPxlU6nlxcVFa1EbQcPHvTmcrnm1tbWP7q6up4nEAj/bybGCTCfcpv/MugJCQnbvv/++921tbW6w8PDEmvWrCm/evWqEEAw2WZmZuWi2o3dEJj6NWvWXCssLFwF9Q8ePFCxsbG51dLSogIevrm5eTmTyTxkZWWV/SkZMZ7m/qdBv3PnzuyIiIhj2dnZdsAwOLdJJJKErKysRGpqqqW9vX1Bfn7+CktLS1xNB0GAv7eCcu3q1atC0CMiIqIjIiKC4BvCu/7+fgjtJFxdXb8LDAyMVFFR+XU8AfQp9vpPgZ6ZmUlnMpmnnj59OhfrnAGAALqRkVFpSUmJWXFxsQmNRqsQJRxpPjrbV69eXVZaWrr6xo0buuvWrbvd3d0t3dvbKxyGgJeWlpZYtGjRg+PHjzstXbq05vcyo6amZo6ysvIwn89/FyEQCARIFpGGh4dfq6qqduLNKRAICLW1tTMFAoFATk5OAuiSl5cnTJo06dXMmTNfj4aO+/fvS8vLy0+FtQYHB4fU1dX/D29cQ0PDdDKZLNHX10dUV1f/lUAg8EczP/Spr6/Xevr0qYqMjEzvrFmzWrS1tV+MNPZ3g37ixAlXf3//5O7ubuGcEHuDlgMoEJaBgwaaefr0aUtZWdluc3Pz90DHM/UWFhYlBQUFtICAgCMsFouJiEVzgwWBsA/+UyiUNjabvY1OpxeNliEZGRk2TCbzR4FAIA2gw5HC5/P5by0N0djY+FpGRoYtHpP37t0blJqaGgzZQ1lZWeKbN29IQNeUKVOe02i0dD8/v4NqamptH6PFxsYm6+effzYjEokkRUXFjnPnzlnr6en9gh1z5syZzUFBQUmwjoyMzMDOnTtjQkJCYsTtEfBISkr6+t69e8uGh4cJgAOZTH5pYGBQsWPHDraFhcUHlvZ3gc7hcNZ/9dVXGT09PR8kWLCxN2inqalppr+//183bdpU8ObNGyFoUIDhYBGgoDEWFhbFfn5++1xdXS+1t7crghAh4UBHAPxHoZ6amlrXDz/8YL1mzZpKcUyB9jNnzjhu27btLKyLBAnRAkJqYGBQU1VVpY8HOpPJZMfFxfmBwAENINgQcUCBbyMjo1/S0tLMR0onNzU1KZuYmDS0tLRMQWsnJCTs+Prrr09gaXd3dz+dlJS0FfoATRYWFll5eXnCo3OkAscdi8UKAd5i+Yq+lZSU+hMTE50dHR3/hp1j1KBfuXJlmYeHR/GzZ88UULiFNoFdEJljBQUFia1bt7KTkpL8wSETBRqBDpK5YMGCG5qamu3Z2dnrkHAg7UZzo98wbtKkScDse8nJyYzR5O7Pnz/v6ODgcBbGKikpSRgaGpaBuQZhlJKSIixevLiGzWbvIhAIA6IM9vb2ZiUmJvoDXaampmUeHh5nGhsbp3M4HLeGhoZ5QJ+np+dh6IMHTk5Ozn9t3rw5r7+/nwg8AIFxcnL6MSUlxRn1B8FgMBh1jx49mo7qdHV1W9LT07UoFMoHNEGf4uLiVXZ2dqWvXr0SWtb169en0On03L6+PrlLly6ty8nJsQec5s2bV1dWVqY/a9asf5yXoGyj0RToQ6PRrhUXF5sC0AAAOFhYrcF+ozm/+OKLfh6PJwOai1eQM6ekpCTo7e0lAAio4M2NFS7o5+vre+zIkSPe4vaAQIfxNBqtvLCwcPVos39BQUH7Y2JiQgGsb7755gCLxQqE9XJzcy22bNmSD8ecvr7+o1u3bs3HoyM2NvZ/AgMDj2Fpnzt3Lu/69et/mTVrVgeMyczMtLKzs8tFCgN1sF5FRYUBlUqtxps3OjraJzQ09CgIEp1OLykqKqKhfgKBQNLY2LiiurraiEwmD6enp69iMBjvjtlRgR4dHb07ODj4AAABi4AEIVCQicZqImgvaAbS7ncS9jbnLvob5oD50LktehRgLQqMhfWBieA0pqen0y0tLa9+DHgw7y4uLmdhnJWVVU5eXp6tOEFB7bt27WIdOnRIqMWhoaEHIiMjhaA/f/5c3sTE5OHjx49na2lptRYXFy8EMEXndXd3T0pOTnaDtVVVVXnNzc3K0KegoMDGwsIiF74DAgLYLBbLD6wjgP3bb78J/aSzZ886ODk5/YRH6759+wL37dsXA7zS0dFpZrFYntbW1gWo782bN+e3tLRoKioqvtbW1v4FS5tY0GFzhoaG9RA3Y000Yj5WEKAOCzhWEPAcOGwd3lGBDeuwQgbzoly+nZ1dPmjKx0BMTk7e4ubmlgbzLVq06MmXX355lEQiCYhEInFgYICgr6//C41GwxUcX19foXkHKxQUFBQbExMjDCcvX74MYWke1M+bN+9hXV3dAjwaqFRqVVVVlSG0eXt7szMyMra3trYq+fv7H2Gz2X5Qb2JiUlNZWakHx4eCgkJXQUHBOgA9JCQkMioqKgxvXoiMrK2tS/v6+kjQDkceWAUqlXpt4cKFVcbGxqUjefBiQY+KitoTEhISC2ACIfAHGtbX1yfUTqT5CCBsTh17m4YlHJuHxwMW21f0bIc27DkPtGRlZdFHAg36nzt3bsuWLVvSYBwUoBkrcN7e3nHx8fG+eMzduXPnocTExADYKySa7OzsMhobG2fk5ubuqKurE2ptYGAgOzY2NkB0PJzVxsbGdW1tbdPl5eXBzFoeOXJkT2FhIQ0AqqqqMigvL1+0du3aOzweTyI2NjYIfA0QLpjLxsYmMycnZ/1IAh0VFbWLzWbHdHZ2Sor2mTFjxm+WlpaZXl5escuWLavDtosFnUql3rp58+ZSpOVgfpCWYTUZ69HCAkgw8AjGevrQjn6DYIHT9x6BmCMB246lw8/PL/7w4cMjXs2mpaU5ODo6nkPzglaAT4KOKSaT+U7rROndv3//vrCwsDAszVh/A/iTlJRkQ6FQPngMcuXKFZMNGzaU9vT0kNTU1Dry8vI0MjIydoaHhx8EU56Tk7OYy+Wu2L179zHgZV5enkl7e7uKk5PT30BAKRTKo8uXLy/BOmGi9GVkZFikp6dv4XK59JaWltmwL+AN0AhWiEKh1HM4HOslS5bUo7EfBb2ysnIJg8H4GSaCswNtVtRpwzopWEHAc+4QyPAfe6cOQCBHDoiG9bAWQTRmh/EovNHR0Xl6/fr1ZYqKii/xhCw1NdXBzc3tHAiurq7uQ19f3wODg4PDb3MLBD09vfsmJiY38cZ6eXkdSkhICABaoL+WltavAKKSklI3jUa76OXlxdbW1m7GG3vy5EkXDw+PVGijUqncqqoqaklJiZG9vX0lj8cjhIaGRt2/f1/34sWL6xctWlRXU1OjU1JSsnjTpk23Ojo6iGQyWVBWVkbR19evHUnbUX1zc/OU6upq6u3bt43z8/MZ4MShNh8fn0NHjx7dPSrQ4+LifJhM5lFxC451u7KyMnjAJqtWrcKN2wH07du3nwNBsra2zsrNzf1o/Ivdj7+//0EI56Bu165dR3x8fCL5fL6MpKRkl6qqat/H9u7r63swPj5+F6y7YcOGzAsXLqwXCATExYsX37979+4CdXX1pqGhIXJbW9tUR0fHZA6H497c3Cy7atWquidPnqjB3BwOZ4uzs/N50XXCwsL2P336VG3mzJkvHRwcTmBNuEAgILm4uBw/e/asOxzHkMgqKipijAp0Nze31OTkZJexBlXc+mB6T5065bl9+/aTeH2x5t3c3LzkypUr78IbcXMDcEePHoUYHkLEKBaLFSpuDGqn0+mFRUVFdPi9e/fu/QcPHtwL3y4uLj+cPn3aHWshk5KSXN3d3ZFVqKypqTEGCxsVFRUUHBwsPOOxZfny5TcrKyuXQV14eHjkt99++57D5+fnF3H48OFwoNvGxuZCdnb2xlGBbmhoWM3lcvVHu8mx6IfMflhYWOz+/fuFnrVoOX/+/GYHBwe4ogVfQ0ClUkveOpDD/f39ikZGRtdYLJZQm0VLcHBwRHR0dDjUgzmOjIwcFehtbW1ypqam9589e6YOPtCJEyfcPD09U2CeU6dObfXw8DgNRwbE5goKCp3Xrl0z0tXVFZ67rq6up1JSUrbDt62tbWZ2dvYHzhxysOEolJaWHnZxcTlsa2tbSCKRXt+6dWt5QkLCrtbW1mlwpMXHx+/09vb+q1jQ4ZJg48aND2pra7XGAszRrolAd3Z25nA4nK1441JSUjbDvTx6lAkahn2+ZWhoeIPL5RrjjfXz8zsUFxcnPNP37NkTFRsbOyrQ4XrZysqqDLQVnNr8/PyVq1evFubBa2tr/7Jy5cqKjo6OaTAvnU4vLSoqMkPrR0ZG7oacAPg52tra9UVFRUtEL3caGxsn+fj4nIMsJuwHhBicw66urnfbgHorK6urBw4csMJm9kZ05F6+fKm4ZMmSFki7jhaAseoHzqOFhUVOTk4ObtIlKyvLOigoKKGrq0sBnEW4LRMIBMPDw8ODkpKSQwYGBtyLFy9uwKM/PDw88OTJk3Au85lMZlxwcHD0aPaZlpbmFBAQcHxoaIioo6NTf/z4cev58+e3orHr1q27dPv27dVw8QNhYWho6Lt5f/rpJ+u9e/eefPXqlZyamtqTlJSUDQsWLGgUXResybFjx4IzMzM3t7a2zoOkDhQVFRXB5MmT69euXXve2dn5iJ6e3ntJoxFBh7vwTZs2lcPlyudeQNspFEpjYmLiWhMTk3t49NbX109TUFAgQLqXTCYTIB4G1KHvwMDAEF42DdrAseLz+UrwLS0t/dvHwifsujweT6m3t/edwsyePfs9Dx/au7u75eB6d86cOW3Y10FwndvU1DRzcHBQUk5OjgDpWgKBMKLT2NXVpXznzp0FPT09YDkEysrKv86ZM6dppCtcXNDT0tI2+vj4JPF4PAWUEv1cgcfGzzo6Os/ZbLbneH5lAwIj7nnZB6A/ePBgHoPBuNXa2vrZm3VRQQSnRl1dvT4/P3/NSLHz5yq8/066PgA9JCTk25iYmL0onSp6/400C5tYwRKMfRWD6rFJFnGbw8vRwxjRZ9NQh2jBZueg7rvvvmN6e3t/9vkFcbz4VO0fgL5ixYrSioqKVaKp0pEIwAPjY33xBGEkoRBHAzZvj80EgpOUlZW17lMx7T993vdA7+zsnAw3ak1NTdMgpMHe72I1GKvteAwQ1faPaTq6BMFe1HxMaNDaote2KGwBrdfQ0Lh//fp1UyUlpQ+uOv/TAfsj6H8PdMjf2traVt+9e1cDMRWrQViTKvqNiBE1zyg/joBHxwIaLwqe6KZG0nak5QhsbNy9cOHCe5mZmdZaWlrP/ggm/dnm+MC8NzQ0qN64cWM5l8ulPnz40ODRo0cUHo+nDC9E0DUqlgmi9+kjCQOqF7USMB5r8vGuZkc606EeYu4ZM2a81NDQuKevr19NoVC4enp695YuXfrgzwbWH7UfsVerEKe2t7fPbW1tVW9vb58JrzEeP36s2t7ergFxaEdHh1J/f78m3K/DH2gchHnYt24AJJ7A4GkxaO7b1KLwWZa8vPzQpEmTeIqKis1TpkzpVlFRaVRTU2uZO3fui2nTpjVoamo+IZPJz7W0tP6RmZgoYjkgFnRxM0Bc2NraOuXly5dfvH79evLr16/lAPC+vj7y4OCgAggCn88n9/f3EwYHB8kAPgBLIpEIRCKxB/wGKSmpHgBaSkqqW1paWiArK9sjLy/fSyKRushkcoeysvKb0b4xF0fvRPvveBg5waw/Dwf+ZU3/87Bi/OxkAvTxg/W7nU6APgH6OOTAONzy3wGv1FG0DsiSNAAAAABJRU5ErkJggg=="
      doc.addImage(imgData, 'PNG', 0.5, 0.4, 1.25, 0.5);

      doc.setPage(i)
      // text is placed using x, y coordinates
      doc.setFontSize(10).text('Southland Regional', 6, 0.5);
      doc.setFontSize(6).text('84 King George Rd', 6, 0.6);
      doc.setFontSize(6).text('P.O Box A1334, Avondale', 6, 0.7);
      doc.setFontSize(6).text('Harare, Zimbabwe', 6, 0.8);
      doc.setFontSize(6).text('email: info@southlandregional.com', 6, 0.9);
      doc.setFontSize(6).text('cell: +263 867 711 5408', 6, 1.0);
      doc.setFontSize(10).text('Task Progress Report', 0.5, 1.2);
      doc.setFontSize(8).text(('Task: ' + task.map(t => `${t.TaskID} - ${t.Description}`)[0] + ' Assigned to: ' + employee.map(e => e.FullName)[0]), 0.5, 1.4);
      // create a line under heading
      doc.setLineWidth(0.01).line(0.5, 1.5, 8, 1.5);
      doc.setLineWidth(0.01).line(0.5, 1.7, 8, 1.7);
      doc.setFontSize(6).text('Page ' + String(i) + ' of ' + String(pageCount), 4.3, 10.7, {
        align: 'center'
      })
    }
  }

  let doc = new jsPDF({
    orientation: "potrait",
    unit: "in",
    format: "letter"
  });

  doc.setFont('helvetica');
  doc.setFontSize(5);
  doc.autoTable({
    columns,
    body: obj,
    margin: { left: 0.5, top: 1.5 },
    styles: {overflow: 'linebreak',
            fontSize: 6},
    showHeader: 'everyPage',
    theme: 'plain'
  });
  addFooters(doc);
  doc.output('dataurlnewwindow');
}

// const openPDF = (Payload) => {
//   getImgFromUrl(Payload, function (img) {
//     generatePDF(img);
//   });
// }

</script>
<style lang="scss" scoped>
.date-label {
  @apply text-xs text-slate-400 dark:text-slate-400 mb-1;
}
.date-text {
  @apply text-xs text-slate-600 dark:text-slate-300 font-medium;
}
</style>
