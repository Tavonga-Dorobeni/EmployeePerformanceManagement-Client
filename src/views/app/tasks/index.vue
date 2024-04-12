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
          title="New Task"
          label="➕ Add Task"
          labelClass="btn-dark dark:bg-green-800  h-min text-sm font-normal"
          ref="modal2"
          centered sizeClass="max-w-5xl"
        >
          <form v-if="!assigned && !emptyPool" class="space-y-4">
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <Textinput
                label="Description"
                type="text"
                v-model="task.Description"
                placeholder="Enter Description"
                name="description"
              />
              <VueSelect label="Site"
                ><vSelect :options="sites.map(s => s.Name)" v-model="task.Site"
              /></VueSelect>
            </div>

            <VueSelect label="Skills"
              ><vSelect :options="skills.map(s => s.Name)" v-model="task.Skills" multiple
            /></VueSelect>

            <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <FromGroup label="Start Date" name="d1">
                <flat-pickr
                  v-model="task.StartDate"
                  class="form-control"
                  id="d1"
                  placeholder="yyyy, dd M"
                />
              </FromGroup>
              <FromGroup label="End Date" name="d2">
                <flat-pickr
                  v-model="task.EndDate"
                  class="form-control"
                  id="d2"
                  placeholder="yyyy, dd M"
                />
              </FromGroup>
            </div>
          </form>

          <form v-if="assigned && !emptyPool" style="height: 350px;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px;">
              <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
                <span class="pt-12 mt-6">
                  <div class="text-xl font-medium text-slate-900 mb-2">
                    Assignment Complete
                  </div>
                  <b class="text-sm text-slate-800">Assigned to: {{ employees.filter(e => e.EmployeeID == assignmentDetails?.EmployeeID).map(e => e.FullName)[0] }}</b>      
                  <p class="text-sm text-slate-800">Overlapping tasks: {{ assignmentDetails?.overlappingTasksCount }}</p>
                  <p class="text-sm text-slate-800">Matching skills:</p>
                  <span
                  v-for="(item, i) in skills.filter(s => assignmentDetails.matchingSkills?.includes(s.SkillID))" :key="i"
                    class="inline-block text-center space-x-1 bg-success-500 bg-opacity-[0.16] min-w-[110px] text-success-500 text-xs font-normal px-2 py-1 rounded-full my-3 mr-2"
                  >
                    {{ item.Name}}
                  </span>
                </span>
                <span>
                  <img
                    src="@/assets/images/all-img/verified.png"
                    alt=""
                    class="mt-10 object-cover rounded-full"
                  />
                </span>          
              </div>
            </div>
          </form>

          <form v-if="!assigned && emptyPool" style="height: 350px;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px;">
              <span class="pt-12">
                <img
                  src="@/assets/images/all-img/flagged.jpg"
                  alt=""
                  class="mt-10 ml-2"
                  style="height: 150px;"
                />
                <div class="text-xl font-medium text-slate-900 mb-2 text-center">
                  There are no employees that match the task requirements!
                </div>
              </span>          
            </div>
          </form>
          <template v-slot:footer>
            <Button
              v-if="!assigned && !emptyPool"
              text="Submit"
              btnClass="btn-dark "
              @click="handleNew(task)"
            />

            <Button
              v-else
              text="Okay"
              btnClass="btn-dark "
              @click="close()"
            />
          </template>
        </Modal>
      </div>
    </div>
    <GridSkletion :count="tasks.length" v-if="isSkeletion" />
    <TableSkeltion :count="tasks.length" v-if="isSkeletion2" />
    <Grid v-if="fillter === 'grid' && !isSkeletion" />
    <List v-if="fillter === 'list' && !isSkeletion2" />

    <TaskAddmodal />
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
import FromGroup from "@/components/FromGroup";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { computed, ref, watch, onMounted, defineEmits } from "vue";
import TaskAddmodal from "./AddTask";
import updateModal from "./EditTask";
import List from "./Tasks-list";
import Grid from "./Tasks-grid";
import { useStore } from "vuex";
import { useEmitter } from "@/mitt";

const {emitter} = useEmitter();
const store = useStore();

let fillter = ref("grid");
const openTask = () => {
  store.dispatch("openTask");
};

let task = ref({});
const modal2 = ref(null)
let assigned = ref(false);
let emptyPool = ref(false);
let assignmentDetails = ref(null)

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

const tasks = computed(() => store.getters.allTasks);
const sites = computed(() => store.getters.allSites);
const skills = computed(() => store.getters.allSkills);
const employees = computed(() => store.getters.allEmployees);

const isSkeletion = ref(true);
const isSkeletion2 = ref(null);
setTimeout(() => {
  isSkeletion.value = false;
  isSkeletion2.value = false;
}, 1000);

const toast = useToast();
const handleNew = (new_task) => {
  new_task.SiteID = store.getters.allSites.filter(s => s.Name == new_task.Site).map(s => s.SiteID)[0]
  new_task.Status = "Pending"

  let taskSkills = store.getters.allSkills.filter(s => new_task.Skills.includes(s.Name)).map(s => s.SkillID)
  let employeePool = store.getters.allEmployees.filter(e => e.skills.map(s => s.SkillID).some(el => taskSkills.includes(el)) && e.SiteID == new_task.SiteID)
  let sortedPool = []

  if(employeePool.length > 0){
    for(let i = 0; i < employeePool.length; i++){
      let matchingSkills = employeePool[i].skills.map(s => s.SkillID).filter(sk => taskSkills.includes(sk))
      let overlappingTasks = employeePool[i].tasks.map(t => store.getters.allTasks.filter(ts => ts.TaskID == t.TaskID)[0]).filter(t => new Date(new_task.StartDate?.substring(0, 10)).getTime() <= new Date(t.EndDate?.substring(0, 10)).getTime() && new Date(new_task.EndDate?.substring(0, 10)).getTime() >= new Date(t.StartDate?.substring(0, 10)).getTime())

      employeePool[i].matchingSkillsCount = matchingSkills.length
      employeePool[i].overlappingTasksCount = overlappingTasks.length
      employeePool[i].matchingSkills = matchingSkills
    }

    sortedPool = employeePool.sort((e1, e2) => (e1.overlappingTasksCount > e2.overlappingTasksCount) ? 1 : (e1.overlappingTasksCount < e2.overlappingTasksCount) ? -1 : 0);

    if(sortedPool.length > 0){
      new_task.EmployeeID = sortedPool[0].EmployeeID
      new_task.Status = 'Assigned'
    }    
  }

  const data = {
    task: new_task,
    skills: taskSkills
  }

  store.dispatch("createTask", data)
  .then(data =>{
    // use vue-toast-notification app use
    toast.success(data.data.message, {
        timeout: 2000,
      });
    if(new_task.Status == 'Assigned'){
      console.log(data)
      store.dispatch('updateEmployee', {EmployeeID: data.data.task.EmployeeID, new_task: data.data.task})
      assignmentDetails.value = sortedPool[0]
      assigned.value = true
    } else {
      emptyPool.value = true
    }
  },
  error => {
    toast.error((error.response && error.response.data) ||
          error.data.message ||
          error.toString(), {
        timeout: 2000,
      });   
  })
}

const close = () => {
  assigned.value = false
  emptyPool.value = false
  modal2.value.closeModal();
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
