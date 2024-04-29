<template>
  <div>
    <Card>
      <div class="dashcode-calender">
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
        ></FullCalendar>
      </div>
      <Modal
        labelClass="btn-outline-dark"
        :activeModal="showModal"
        @close="hideModal"
        title="Activity"
      >
        <!-- :validation-schema="schema" -->
        <Form @submit="onSubmit">
          <div class="space-y-3">
            <VueSelect label="Task"
              ><vSelect :options="allTasks.map(s => `ID: ${s.TaskID}, ${s.Description}`)" v-model="activity.Task"
            /></VueSelect>
            
            <Textinput
              v-model="activity.Activity"
              type="text"
              label="Activity Description"
              placeholder="Insert Activity Description"
            />

            <!-- <div class="fromGroup">
              <label class="form-label">Category</label>
              <select
                v-model="activity.category"
                class="form-control"
                name="category"
              >
                <option
                  v-for="option in categories"
                  :key="option.backgroundColor"
                  :value="`${option.value}`"
                >
                  {{ option.name }}
                </option>
              </select>
            </div> -->
          </div>
          <div class="flex justify-between items-center mt-5">
            <Button
              text="close"
              btnClass="btn-light"
              @click="hideModal"
              type="button"
            />
            <Button
              text="save"
              btnClass="btn-success"
              type="submit"
            />
          </div>
        </Form>
      </Modal>
      <Modal :activeModal="activityModal" @close="closeModal" title="Edit Activity">
        <Form @submit="editSubmit">
          <div class="space-y-3">
            <VueSelect label="Task"
              ><vSelect :options="allTasks.map(s => `ID: ${s.TaskID}, ${s.Description}`)" v-model="editactivity.editTask"
            /></VueSelect>

            <Textinput
              v-model="editactivity.editActivity"
              type="text"
              label="Activity Description"
              placeholder="Insert Activity Description"
            />

            <!-- <div class="fromGroup">
              <label class="form-label">Category</label>
              <select
                v-model="editactivity.editcategory"
                class="form-control"
                name="category"
              >
                <option
                  v-for="option in categories"
                  :key="option.backgroundColor"
                  :value="`${option.value}`"
                >
                  {{ option.name }}
                </option>
              </select>
            </div> -->
          </div>
          <div class="flex justify-between items-center mt-5">
            <div>
              <Button
                text="Delete"
                btnClass="btn-danger"
                type="button"
                @click="confirm"
              />
            </div>
            <div class="flex space-x-5">
              <Button
                text="close"
                btnClass="btn-light"
                @click="closeModal"
                type="button"
              />
              <Button
                text="save"
                btnClass="btn-success"
                @click="editSubmit"
              />
            </div>
          </div>
        </Form>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Textinput from "@/components/Textinput";
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { calendarEvents, categories } from "./Initialize-event";
import { Form } from "vee-validate";
import { mapGetters } from 'vuex';

export default {
  name: "calander",
  components: {
    FullCalendar,
    Card,
    Modal,
    Button,
    Form,
    Textinput,
    VueSelect,
    vSelect,
  },

  data() {
    return {
      title: "Calendar",
      errors: [],
      calendarOptions: {
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        initialView: "dayGridMonth",
        themeSystem: "bootstrap",
        events: [],
        editable: true,
        droppable: true,
        eventResizableFromStart: true,
        dateClick: this.dateClicked,
        eventClick: this.editActivity,
        eventsSet: this.handleActivities,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
      },
      currentActivities: [],
      showModal: false,
      activityModal: false,
      categories: categories,
      submitted: false,
      submit: false,
      newActivityData: {},
      edit: {},
      deleteId: {},
      activity: {
        Task: "",
        Activity: "",
      },
      editactivity: {
        editTask: "",
        editActivity: "",
      },
    };
  },

  computed: {
    ...mapGetters([
      "allTasks",
      "allTaskActivities"
    ]),
    // calendarEvents() {
    //   this.calendarEvents = this.allTaskActivities.map(t => ({id: t.TaskActivityID, title: t.Activity, start: t.Date, className: "bg-primary-500 text-white"}))
    //   return events
    // },
    titleIsvalid() {
      return !!this.activity.title;
    },
    categoryIsvalid() {
      return !!this.activity.category;
    },
    formisValid() {
      return this.titleIsvalid && this.categoryIsvalid;
    },
    editformvIsvalid() {
      return this.editactivity.editTitle && this.editactivity.editcategory;
    },
  },

  methods: {
    onSubmit() {
      const toast = useToast();
      this.submitted = true;

      this.activity.TaskID = this.allTasks.filter(t => this.activity.Task.split(',')[0].includes(t.TaskID)).map(t => t.TaskID)[0]
      this.activity.Date = this.newActivityData.date

      this.$store.dispatch("createTaskActivity", this.activity)
      .then(data =>{
        this.successmsg();
        this.calendarOptions.events = this.allTaskActivities.map(t => ({id: t.TaskActivityID, task: t.TaskID, title: t.Activity, start: t.Date, className: "bg-primary-500 text-white"}))
        this.showModal = false;
        this.newActivityData = {};
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

      this.submitted = false;
      this.activity = {};
    },
    // this.$swal
    // eslint-disable-next-line no-unused-vars
    hideModal(e) {
      this.submitted = false;
      this.showModal = false;
      this.activity = {};
    },
    /**
     * Edit activity modal submit
     */
    // eslint-disable-next-line no-unused-vars
    editSubmit(e) {
      this.submit = true;
      const toast = useToast();
      const data = {
        TaskActivityID: this.editactivity.id,
        TaskID: this.allTasks.filter(t => this.editactivity.editTask.split(',')[0].includes(t.TaskID)).map(t => t.TaskID)[0],
        Activity: this.editactivity.editActivity,
      }

      this.$store.dispatch('updateTaskActivity', data)
      .then(response => {
        this.calendarOptions.events = this.allTaskActivities.map(t => ({id: t.TaskActivityID, task: t.TaskID, title: t.Activity, start: t.Date, className: "bg-primary-500 text-white"}))
        this.successmsg();
        this.activityModal = false;
        toast.success(response.data.message, {
          timeout: 2000,
        });    
      },
      error => {
        this.$refs.modal2.closeModal();
        toast.error((error.response && error.response.data) ||
              error.data.message ||
              error.toString(), {
            timeout: 2000,
          });   
      })
    },

    /**
     * Delete activity
     */
    deleteActivity() {
      this.$store.dispatch('deleteTaskActivity', {TaskActivityID: this.edit.id})
      .then(response => {
        this.calendarOptions.events = this.allTaskActivities.map(t => ({id: t.TaskActivityID, task: t.TaskID, title: t.Activity, start: t.Date, className: "bg-primary-500 text-white"}))
        this.activityModal = false;
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
    /**
     * Modal open for add activity
     */
    dateClicked(info) {
      this.newActivityData = info;
      this.showModal = true;
    },
    /**
     * Modal open for edit activity
     */
    editActivity(info) {
      this.edit = info.event;
      this.editactivity.id = this.edit.id;
      this.editactivity.editTask = this.allTasks.filter(t => t.TaskID == this.allTaskActivities.filter(a => a.TaskActivityID == this.edit.id).map(a => a.TaskID)[0]).map(s => `ID: ${s.TaskID}, ${s.Description}`)[0] ;
      this.editactivity.editActivity = this.edit.title;
      this.editactivity.editcategory = this.edit.classNames[0];
      this.activityModal = true;
    },

    closeModal() {
      this.activityModal = false;
    },

    confirm() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to delete this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!",
          background: this.$store.state.isDark ? "#1e293b" : "#fff",
        })
        .then((result) => {
          if (result.value) {
            this.deleteActivity();
            this.$swal.fire("Deleted!", "Activity has been deleted.", "success");
          }
        });
    },

    /**
     * Show list of activities
     */
    handleActivities(activities) {
      this.currentActivities = activities;
    },

    /**
     * Show success-500full Save Dialog
     */
    successmsg() {
      this.$swal.fire({
        position: "center",
        icon: "success",
        title: "Activity has been saved",
        showConfirmButton: false,
        background: this.$store.state.isDark ? "#1e293b" : "#fff",
        timer: 1000,
      });
    },
  },

  mounted() {
    this.calendarOptions.events = this.allTaskActivities.map(t => ({id: t.TaskActivityID, task: t.TaskID, title: t.Activity, start: t.Date, className: "bg-primary-500 text-white"}))
  }
};
</script>
<style lang="scss">
.fc-toolbar-chunk button {
  height: 50px;
  //min-width: 70px;
  &.fc-prev-button {
    &:after {
      // content: url("https://api.iconify.design/akar-icons/chevron-left.svg?color=white&width=24");
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &.fc-next-button {
    &:after {
      //content: url("https://api.iconify.design/akar-icons/chevron-right.svg?color=white&width=24");
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.fc-button {
  font-size: 14px !important;
  line-height: 14px !important;
  height: auto !important;
  text-transform: capitalize !important;
  font-family: Inter !important;
  padding: 12px 20px 12px 20px !important;
}
.fc .fc-button-primary {
  background: transparent !important;
  @apply text-slate-900 dark:text-white border-slate-100 dark:border-slate-700;
}
.fc .fc-button-primary:not(:disabled):active,
.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:hover {
  background: #111112 !important;
}
.dark {
  .fc .fc-button-primary:not(:disabled):active,
  .fc .fc-button-primary:not(:disabled).fc-button-active,
  .fc .fc-button-primary:hover {
    background: #0f172a !important;
  }
}
.fc .fc-button-primary:disabled {
  background: #a0aec0 !important;
  border-color: #a0aec0 !important;
  @apply cursor-not-allowed;
}
.dark {
  .fc .fc-button-primary:disabled {
    background: #334155 !important;
    border-color: #334155 !important;
  }
}
.fc .fc-daygrid-day.fc-day-today {
  background: rgba(95, 99, 242, 0.04) !important;
}
.dark {
  .fc .fc-daygrid-day.fc-day-today {
    background: #334155 !important;
  }
}
.fc .fc-button-primary:focus {
  box-shadow: none !important;
}
.fc-theme-standard .fc-scrollgrid {
  border-color: #eef1f9 !important;
}
.dark {
  .fc-theme-standard .fc-scrollgrid {
    border-color: #334155 !important;
  }
}
.fc-theme-standard td,
.fc-theme-standard th {
  @apply border-slate-100 dark:border-slate-700;
}
.fc-col-header-cell .fc-scrollgrid-sync-inner {
  @apply bg-slate-50 dark:bg-slate-700  text-xs text-slate-500 dark:text-slate-300 font-normal py-3;
}
.fc-daygrid-day-top {
  @apply text-sm px-3 py-2  text-slate-900 dark:text-white font-normal;
}
.fc-h-event .fc-event-main-frame {
  @apply justify-center text-center w-max mx-auto;
  .fc-event-time {
    @apply font-normal flex-none;
  }
}
.fc-event-time {
  @apply text-sm font-normal;
}
.fc-event-title {
  font-size: 14px !important;
  font-weight: 300 !important;
}
.fc .fc-toolbar-title {
  @apply text-lg font-normal text-slate-600 dark:text-slate-300;
}
// event css
.fc-daygrid-event-dot {
  @apply hidden;
}
.dashcode-calender {
  .bg-primary-500 {
    @apply bg-[#4669FA] border-none text-white text-center px-2 font-medium text-sm;
  }
  .bg-secondary-500 {
    @apply bg-[#A0AEC0] border-none text-white text-center px-2 font-medium text-sm;
  }
  .bg-danger-500 {
    @apply bg-[#F1595C] border-none text-white text-center px-2 font-medium text-sm;
  }
  .bg-info {
    @apply bg-[#0CE7FA] border-none text-white text-center px-2 font-medium text-sm;
  }
  .bg-warning-500 {
    @apply bg-[#FA916B] border-none text-white text-center px-2 font-medium text-sm;
  }
  .bg-success-500 {
    @apply bg-[#50C793] border-none text-white text-center px-2 font-medium text-sm;
  }
  .bg-slate-800 {
    @apply bg-[#222] border-none text-white text-center px-2 font-medium text-sm;
  }
}
@media (max-width: 981px) {
  .fc-button-group,
  .fc .fc-toolbar {
    display: block !important;
  }
  .fc .fc-toolbar {
    @apply space-y-4;
  }
  .fc-toolbar-chunk {
    @apply space-y-4;
  }
  .fc .fc-button {
    padding: 0.4em 0.65em !important;
  }
}
.fc .fc-timegrid-axis-cushion,
.fc .fc-timegrid-slot-label-cushion {
  @apply dark:text-slate-300;
}
.fc .fc-list-event:hover td {
  @apply bg-inherit;
}
.fc .fc-list-event-dot {
  @apply hidden;
}
.fc-direction-ltr .fc-list-day-text,
.fc-direction-rtl .fc-list-day-side-text,
.fc-direction-ltr .fc-list-day-side-text,
.fc-direction-rtl .fc-list-day-text {
  font-size: 16px;
  font-weight: 500;
}
</style>
